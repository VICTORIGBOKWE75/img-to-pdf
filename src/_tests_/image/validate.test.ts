import { describe, expect, it } from "vitest";

import {
  MAX_IMAGES,
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_PIXELS,
  MAX_FILE_SIZE,
  validateImageCount,
  validateImageDimensions,
  validateImageFile,
} from "@/lib/image/validate";

describe("validateImageFile", () => {
  it("accepts a valid JPEG", () => {
    const file = new File(
      ["image data"],
      "photo.jpg",
      { type: "image/jpeg" }
    );

    expect(validateImageFile(file)).toBeNull();
  });

  it("accepts PNG", () => {
    const file = new File(
      ["image data"],
      "photo.png",
      { type: "image/png" }
    );

    expect(validateImageFile(file)).toBeNull();
  });

  it("accepts WebP", () => {
    const file = new File(
      ["image data"],
      "photo.webp",
      { type: "image/webp" }
    );

    expect(validateImageFile(file)).toBeNull();
  });

  it("rejects unsupported image types", () => {
    const file = new File(
      ["image data"],
      "document.pdf",
      { type: "application/pdf" }
    );

    expect(validateImageFile(file)).toContain(
      "Unsupported image type"
    );
  });

  it("rejects empty files", () => {
    const file = new File(
      [],
      "empty.jpg",
      { type: "image/jpeg" }
    );

    expect(validateImageFile(file)).toContain(
      "empty"
    );
  });

  it("rejects files larger than the limit", () => {
    const file = new File(
      [new Uint8Array(MAX_FILE_SIZE + 1)],
      "large.jpg",
      { type: "image/jpeg" }
    );

    expect(validateImageFile(file)).toContain(
      "20MB"
    );
  });
});

describe("validateImageCount", () => {
  it("allows images within the limit", () => {
    expect(
      validateImageCount(0, 1)
    ).toBeNull();

    expect(
      validateImageCount(MAX_IMAGES - 1, 1)
    ).toBeNull();
  });

  it("rejects images exceeding the limit", () => {
    expect(
      validateImageCount(MAX_IMAGES, 1)
    ).toContain(`${MAX_IMAGES}`);
  });
});

describe("validateImageDimensions", () => {
  it("accepts valid dimensions", () => {
    expect(
      validateImageDimensions(1920, 1080)
    ).toBeNull();
  });

  it("rejects invalid dimensions", () => {
    expect(
      validateImageDimensions(0, 100)
    ).toContain("invalid");
  });

  it("rejects dimensions above the maximum", () => {
    expect(
      validateImageDimensions(
        MAX_IMAGE_DIMENSION + 1,
        1000
      )
    ).toContain("too large");
  });

  it("rejects images with too many pixels", () => {
    expect(
        validateImageDimensions(
        7000,
        6000
        )
    ).toContain("too many pixels");
    });
});