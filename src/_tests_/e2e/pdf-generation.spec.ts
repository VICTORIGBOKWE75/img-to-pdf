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

  
test("uploads an image and generates a PDF", async ({ page }) => {
  page.on("console", (message) => {
    console.log(`[browser:${message.type()}] ${message.text()}`);
  });

  page.on("pageerror", (error) => {
    console.log(`[pageerror] ${error.message}`);
  });

  page.on("requestfailed", (request) => {
    console.log(
      `[requestfailed] ${request.url()} — ${request.failure()?.errorText}`
    );
  });

  await page.goto("/");

  const fileInputs = page.locator('input[type="file"]');
  console.log("File input count:", await fileInputs.count());

  for (let i = 0; i < await fileInputs.count(); i++) {
    console.log(`Input ${i}:`, await fileInputs.nth(i).evaluate((el) => ({
      accept: (el as HTMLInputElement).accept,
      multiple: (el as HTMLInputElement).multiple,
      disabled: (el as HTMLInputElement).disabled,
    })));
  }

  const fileInput = fileInputs.first();

  await fileInput.setInputFiles({
    name: "test-image.png",
    mimeType: "image/png",
    buffer: TEST_PNG,
  });

  console.log(
    "Files assigned:",
    await fileInput.evaluate((el) =>
      Array.from((el as HTMLInputElement).files ?? []).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }))
    )
  );

  await page.waitForTimeout(1500);
  await page.screenshot({
    path: "test-results/upload-debug.png",
    fullPage: true,
  });

  console.log("Page after upload:", await page.locator("body").innerText());

  await expect(page.getByText("test-image.png")).toBeVisible({
    timeout: 5000,
  });
});


  test("generates and downloads the PDF", async ({
    page,
  }) => {
    await page.goto("/");

    const fileInput = page.locator(
      'input[type="file"]'
    );

    await fileInput.setInputFiles({
      name: "download-test.png",
      mimeType: "image/png",
      buffer: TEST_PNG,
    });

    const convertButton =
      page.getByRole("button", {
        name: /convert|create pdf/i,
      });

    await expect(
      convertButton
    ).toBeVisible({
      timeout: 10_000,
    });

    await convertButton.click();

    const downloadButton =
      page.getByRole("button", {
        name: /download pdf/i,
      });

    await expect(
      downloadButton
    ).toBeVisible({
      timeout: 30_000,
    });

    const downloadPromise =
      page.waitForEvent("download");

    await downloadButton.click();

    const download =
      await downloadPromise;

    expect(
      download.suggestedFilename()
    ).toMatch(/\.pdf$/i);
  });
});