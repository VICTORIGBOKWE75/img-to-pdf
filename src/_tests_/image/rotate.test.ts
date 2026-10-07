import { describe, expect, it } from "vitest";

import {
  getRotatedDimensions,
} from "@/lib/image/rotate";

describe("getRotatedDimensions", () => {
  const dimensions = {
    width: 1920,
    height: 1080,
  };

  it("keeps dimensions unchanged at 0 degrees", () => {
    expect(
      getRotatedDimensions(
        dimensions,
        0
      )
    ).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it("swaps dimensions at 90 degrees", () => {
    expect(
      getRotatedDimensions(
        dimensions,
        90
      )
    ).toEqual({
      width: 1080,
      height: 1920,
    });
  });

  it("keeps dimensions unchanged at 180 degrees", () => {
    expect(
      getRotatedDimensions(
        dimensions,
        180
      )
    ).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it("swaps dimensions at 270 degrees", () => {
    expect(
      getRotatedDimensions(
        dimensions,
        270
      )
    ).toEqual({
      width: 1080,
      height: 1920,
    });
  });
});