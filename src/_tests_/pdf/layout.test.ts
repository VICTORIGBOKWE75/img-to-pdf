import { describe, expect, it } from "vitest";

import {
  calculateImageLayout,
  getContentArea,
} from "@/lib/pdf/layout";

describe("calculateImageLayout", () => {
  const page = {
    width: 600,
    height: 800,
  };

  it("fits a landscape image inside the page", () => {
    const result = calculateImageLayout(
      page,
      {
        width: 1200,
        height: 600,
      },
      20,
      "fit"
    );

    expect(result.width).toBe(560);
    expect(result.height).toBe(280);
    expect(result.x).toBe(20);
    expect(result.y).toBe(260);
  });

  it("fits a portrait image inside the page", () => {
    const result = calculateImageLayout(
      page,
      {
        width: 600,
        height: 1200,
      },
      20,
      "fit"
    );

    expect(result.width).toBe(380);
    expect(result.height).toBe(760);
    expect(result.x).toBe(110);
    expect(result.y).toBe(20);
  });

  it("uses the full content area for fill", () => {
    const result = calculateImageLayout(
      page,
      {
        width: 1200,
        height: 600,
      },
      20,
      "fill"
    );

    expect(result.width).toBe(1520);
    expect(result.height).toBe(760);
    expect(result.x).toBe(-460);
    expect(result.y).toBe(20);
  });

  it("rejects margins that leave no usable area", () => {
    expect(() =>
      calculateImageLayout(
        page,
        {
          width: 100,
          height: 100,
        },
        400,
        "fit"
      )
    ).toThrow(
      "Margins are too large"
    );
  });
});

describe("getContentArea", () => {
  it("returns the area inside the margins", () => {
    expect(
      getContentArea(
        {
          width: 600,
          height: 800,
        },
        20
      )
    ).toEqual({
      x: 20,
      y: 20,
      width: 560,
      height: 760,
    });
  });

  it("rejects excessive margins", () => {
    expect(() =>
      getContentArea(
        {
          width: 600,
          height: 800,
        },
        400
      )
    ).toThrow(
      "Margins are too large"
    );
  });
});