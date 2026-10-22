import { test, expect } from "@playwright/test";
import { deflateSync } from "node:zlib";

function createTestPng(): Buffer {
  const width = 100;
  const height = 100;

  // RGBA pixels with a simple solid image.
  const raw = Buffer.alloc(
    height * (1 + width * 4)
  );

  for (let y = 0; y < height; y++) {
    const rowStart =
      y * (1 + width * 4);

    // PNG filter byte: "None"
    raw[rowStart] = 0;

    for (let x = 0; x < width; x++) {
      const pixelStart =
        rowStart + 1 + x * 4;

      raw[pixelStart] = 80; // R
      raw[pixelStart + 1] = 140; // G
      raw[pixelStart + 2] = 220; // B
      raw[pixelStart + 3] = 255; // A
    }
  }

  function chunk(
    type: string,
    data: Buffer
  ): Buffer {
    const typeBuffer =
      Buffer.from(type, "ascii");

    const length = Buffer.alloc(4);
    length.writeUInt32BE(
      data.length,
      0
    );

    const crc = Buffer.alloc(4);

    // CRC-32 implementation for PNG chunks.
    let crcValue = 0xffffffff;

    const bytes = Buffer.concat([
      typeBuffer,
      data,
    ]);

    for (const byte of bytes) {
      crcValue ^= byte;

      for (let bit = 0; bit < 8; bit++) {
        crcValue =
          (crcValue >>> 1) ^
          (crcValue & 1
            ? 0xedb88320
            : 0);
      }
    }

    crcValue =
      (crcValue ^ 0xffffffff) >>> 0;

    crc.writeUInt32BE(crcValue, 0);

    return Buffer.concat([
      length,
      typeBuffer,
      data,
      crc,
    ]);
  }

  const signature = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ]);

  const ihdr = Buffer.alloc(13);

  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const TEST_PNG = createTestPng();

test.describe("PDF generation", () => {
  test("loads the image-to-PDF application", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Convert images to PDF",
      })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Your images never leave your device."
      )
    ).toBeVisible();
  });

  

  test("uploads an image and displays it in the workspace", async ({
    page,
  }) => {
    await page.goto("/");

    const fileInput = page.locator(
      'input[type="file"]'
    );

    await fileInput.setInputFiles({
      name: "test-image.png",
      mimeType: "image/png",
      buffer: TEST_PNG,
    });

    await expect(
      page.getByText("test-image.png")
    ).toBeVisible({
      timeout: 10_000,
    });

    await expect(
      page.getByText("1 image selected")
    ).toBeVisible();
  });


  
  test("generates and downloads a valid one-page PDF", async ({
    page,
  }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: "download-test.png",
      mimeType: "image/png",
      buffer: TEST_PNG,
    });

    const convertButton = page.getByRole("button", {
      name: /convert|create pdf/i,
    });

    await expect(convertButton).toBeVisible({ timeout: 10_000 });
    await convertButton.click();

    const downloadButton = page.getByRole("button", {
      name: /download pdf/i,
    });

    await expect(downloadButton).toBeVisible({ timeout: 30_000 });

    const downloadPromise = page.waitForEvent("download");
    await downloadButton.click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    const filePath = await download.path();
    expect(filePath).not.toBeNull();

    const { readFile } = await import("node:fs/promises");
    const pdfBytes = await readFile(filePath!);

    // A PDF file begins with the "%PDF-" signature.
    expect(pdfBytes.subarray(0, 5).toString("ascii")).toBe("%PDF-");

    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);

    expect(pdf.getPageCount()).toBe(1);
  });


  
  test("uploads multiple images and supports rotation and removal", async ({
    page,
  }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles([
      {
        name: "image-one.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      },
      {
        name: "image-two.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      },
    ]);

    await expect(
      page.getByText("2 images selected")
    ).toBeVisible();

    await expect(
      page.getByAltText("image-one.png")
    ).toBeVisible();

    await expect(
      page.getByAltText("image-two.png")
    ).toBeVisible();

    // Rotate the first image and verify its displayed rotation.
    await page
      .getByRole("button", { name: "Rotate image" })
      .first()
      .click();

    await expect(
      page.getByAltText("image-one.png")
    ).toHaveAttribute("style", /rotate\(90deg\)/);

    // Remove the second image.
    await page
      .getByRole("button", { name: "Remove image" })
      .nth(1)
      .click();

    await expect(
      page.getByText("1 image selected")
    ).toBeVisible();

    await expect(
      page.getByAltText("image-two.png")
    ).not.toBeVisible();

    await expect(
      page.getByAltText("image-one.png")
    ).toBeVisible();
  });

  
  test("updates PDF settings and preserves the selected values", async ({
    page,
  }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');

        await fileInput.setInputFiles({
        name: "settings-test.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      });

    await expect(page.getByAltText("settings-test.png")).toBeVisible();

    const pageSize = page.locator("#pdf-page-size");
    const orientation = page.locator("#pdf-orientation");
    const margin = page.locator("#pdf-margin");
    const imageFit = page.locator("#pdf-image-fit");
    const quality = page.locator("#pdf-quality");
    await pageSize.selectOption("LETTER");
    await orientation.selectOption("landscape");
    await margin.fill("15");
    await imageFit.selectOption("fill");
    await quality.selectOption("high");

    await expect(pageSize).toHaveValue("LETTER");
    await expect(orientation).toHaveValue("landscape");
    await expect(margin).toHaveValue("15");
    await expect(imageFit).toHaveValue("fill");
    await expect(quality).toHaveValue("high");
  });

  
  test("generates a two-page PDF from two images", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles([
      {
        name: "page-one.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      },
      {
        name: "page-two.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      },
    ]);

    await expect(page.getByText("2 images selected")).toBeVisible();

    const convertButton = page.getByRole("button", {
      name: /convert|create pdf/i,
    });

    await expect(convertButton).toBeVisible({ timeout: 10_000 });
    await convertButton.click();

    const downloadButton = page.getByRole("button", {
      name: /download pdf/i,
    });

    await expect(downloadButton).toBeVisible({ timeout: 30_000 });

    const downloadPromise = page.waitForEvent("download");
    await downloadButton.click();

    const download = await downloadPromise;
    const filePath = await download.path();

    expect(filePath).not.toBeNull();

    const { readFile } = await import("node:fs/promises");
    const pdfBytes = await readFile(filePath!);
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);

    expect(pdf.getPageCount()).toBe(2);
  });


  
  
  test("enforces the 30-image limit", async ({ page }) => {
    await page.goto("/");

    // The initial upload screen has the first file input.
    await page.locator('input[type="file"]').setInputFiles(
      Array.from({ length: 29 }, (_, index) => ({
        name: `limit-test-${index + 1}.png`,
        mimeType: "image/png",
        buffer: TEST_PNG,
      }))
    );

    await expect(page.getByText("29 images selected")).toBeVisible({
      timeout: 30_000,
    });

    // Re-query after the workspace has mounted.
    await page.locator('input[type="file"]').setInputFiles([
      {
        name: "limit-test-30.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      },
      {
        name: "limit-test-31.png",
        mimeType: "image/png",
        buffer: TEST_PNG,
      },
    ]);

    await expect(page.getByText("30 images selected")).toBeVisible({
      timeout: 30_000,
    });

    await expect(
      page.getByText("1 image could not be added.")
    ).toBeVisible();

    await expect(
      page.locator('button[aria-label="Remove image"]')
    ).toHaveCount(30);
  });





});