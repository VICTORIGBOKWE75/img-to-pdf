import type {
  PdfOrientation,
  PdfPageSize,
} from "@/types/pdf";

export interface PageDimensions {
  width: number;
  height: number;
}

const MM_TO_POINTS = 72 / 25.4;

const PAGE_SIZES_MM: Record<
  PdfPageSize,
  PageDimensions
> = {
  A4: {
    width: 210,
    height: 297,
  },
  LETTER: {
    width: 215.9,
    height: 279.4,
  },
};

export function getPageDimensions(
  pageSize: PdfPageSize,
  orientation: PdfOrientation
): PageDimensions {
  const size = PAGE_SIZES_MM[pageSize];

  const width = size.width * MM_TO_POINTS;
  const height = size.height * MM_TO_POINTS;

  if (orientation === "landscape") {
    return {
      width: height,
      height: width,
    };
  }

  return {
    width,
    height,
  };
}

export function mmToPoints(mm: number): number {
  return mm * MM_TO_POINTS;
}