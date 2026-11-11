
import { test, expect } from "@playwright/test";
import { deflateSync } from "node:zlib";

function createTestPng(): Buffer {
  const width = 100;
  const height = 100;
  const raw = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    raw[rowStart] = 0;

    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 4;
      raw[pixelStart] = 80;
      raw[pixelStart + 1] = 140;
      raw[pixelStart + 2] = 220;
      raw[pixelStart + 3] = 255;
    }
  }

  function chunk(type: string, data: Buffer): Buffer {
    const typeBuffer = Buffer.from(type, "ascii");
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    const bytes = Buffer.concat([typeBuffer, data]);
    let crcValue = 0xffffffff;

    for (const byte of bytes) {
      crcValue ^= byte;
      for (let bit = 0; bit < 8; bit++) {
        crcValue =
          (crcValue >>> 1) ^
          (crcValue & 1 ? 0xedb88320 : 0);
      }
    }

    const crc = Buffer.alloc(4);
    crc.writeUInt32BE((crcValue ^ 0xffffffff) >>> 0, 0);

    return Buffer.concat([length, typeBuffer, data, crc]);
  }

  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

test("image upload and PDF generation make no external network requests", async ({
  page,
}) => {
  const externalRequests: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());

    const isLocal =
      url.hostname === "127.0.0.1" ||
      url.hostname === "localhost";

    if (!isLocal && !["data:", "blob:"].includes(url.protocol)) {
      externalRequests.push(request.url());
    }
  });

  await page.goto("/");

  await page.locator('input[type="file"]').setInputFiles({
    name: "privacy-test.png",
    mimeType: "image/png",
    buffer: createTestPng(),
  });

  await expect(page.getByText("privacy-test.png")).toBeVisible({
    timeout: 10_000,
  });

  await page.getByRole("button", {
    name: "Convert to PDF",
  }).click();

  await expect(
    page.getByRole("heading", { name: "PDF ready" })
  ).toBeVisible({ timeout: 20_000 });

  await expect(
    page.getByRole("button", { name: "Download PDF" })
  ).toBeVisible();

  expect(externalRequests).toEqual([]);
});
