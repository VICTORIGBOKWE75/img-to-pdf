import type { PdfImageFit } from "@/types/pdf";

interface ImageDimensions {
  width: number;
  height: number;
}

interface PageLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateImageLayout(
  page: ImageDimensions,
  image: ImageDimensions,
  margin: number,
  fit: PdfImageFit
): PageLayout {
  const availableWidth =
    page.width - margin * 2;

  const availableHeight =
    page.height - margin * 2;

  if (
    availableWidth <= 0 ||
    availableHeight <= 0
  ) {
    throw new Error(
      "Margins are too large for the selected page size."
    );
  }

  const widthRatio =
    availableWidth / image.width;

  const heightRatio =
    availableHeight / image.height;

  const scale =
    fit === "fill"
      ? Math.max(widthRatio, heightRatio)
      : Math.min(widthRatio, heightRatio);

  const width = image.width * scale;
  const height = image.height * scale;

  const x =
    (page.width - width) / 2;

  const y =
    (page.height - height) / 2;

  return {
    x,
    y,
    width,
    height,
  };
}