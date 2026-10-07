import { describe, expect, it } from "vitest";

import {
  calculateResizedDimensions,
} from "@/lib/image/resize";

describe("calculateResizedDimensions", () => {
  it("does not enlarge a small image", () => {
    expect(
      calculateResizedDimensions(
        1000,
        500,
        {
          maxWidth: 4096,
          maxHeight: 4096,
        }
      )
    ).toEqual({
      width: 1000,
      height: 500,
    });
  });

  it("resizes a large landscape image proportionally", () => {
    expect(
      calculateResizedDimensions(
        8000,
        4000,
        {
          maxWidth: 4096,
          maxHeight: 4096,
        }
      )
    ).toEqual({
      width: 4096,
      height: 2048,
    });
  });

  it("resizes a large portrait image proportionally", () => {
    expect(
      calculateResizedDimensions(
        4000,
        8000,
        {
          maxWidth: 4096,
          maxHeight: 4096,
        }
      )
    ).toEqual({
      width: 2048,
      height: 4096,
    });
  });

  it("rejects invalid dimensions", () => {
    expect(() =>
      calculateResizedDimensions(
        0,
        1000,
        {
          maxWidth: 4096,
          maxHeight: 4096,
        }
      )
    ).toThrow("Invalid image dimensions.");
  });
});