import { describe, expect, it } from "vitest";

import {
  getPageDimensions,
  mmToPoints,
} from "@/lib/pdf/dimensions";

describe("mmToPoints", () => {
  it("converts millimeters to PDF points", () => {
    expect(mmToPoints(25.4)).toBeCloseTo(72);
  });
});

describe("getPageDimensions", () => {
  it("returns A4 portrait dimensions", () => {
    const result = getPageDimensions(
      "A4",
      "portrait"
    );

    expect(result.width).toBeCloseTo(595.28);
    expect(result.height).toBeCloseTo(841.89);
  });

  it("returns A4 landscape dimensions", () => {
    const result = getPageDimensions(
      "A4",
      "landscape"
    );

    expect(result.width).toBeCloseTo(841.89);
    expect(result.height).toBeCloseTo(595.28);
  });

  it("returns Letter portrait dimensions", () => {
    const result = getPageDimensions(
      "LETTER",
      "portrait"
    );

    expect(result.width).toBeCloseTo(612);
    expect(result.height).toBeCloseTo(792);
  });

  it("returns Letter landscape dimensions", () => {
    const result = getPageDimensions(
      "LETTER",
      "landscape"
    );

    expect(result.width).toBeCloseTo(792);
    expect(result.height).toBeCloseTo(612);
  });
});