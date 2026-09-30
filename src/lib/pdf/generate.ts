import {
  PDFDocument,
  type PDFImage,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
} from "pdf-lib";

import type { ImageItem } from "@/types/image";
import type { PdfOptions } from "@/types/pdf";

import { processImage } from "@/lib/image/process";

import {
  getPageDimensions,
  mmToPoints,
} from "./dimensions";

import {
  calculateImageLayout,
  getContentArea,
} from "./layout";

export interface PdfGenerationProgress {
  current: number;
  total: number;
  percentage: number;
}

interface GeneratePdfOptions extends PdfOptions {
  onProgress?: (
    progress: PdfGenerationProgress
  ) => void;
}

function getProcessingQuality(
  quality: PdfOptions["quality"]
): number {
  switch (quality) {
    case "small":
      return 0.7;

    case "high":
      return 0.95;

    case "balanced":
    default:
      return 0.9;
  }
}

async function embedImage(
  pdf: PDFDocument,
  blob: Blob
): Promise<PDFImage> {
  const bytes = new Uint8Array(
    await blob.arrayBuffer()
  );

  if (blob.type === "image/png") {
    return pdf.embedPng(bytes);
  }

  return pdf.embedJpg(bytes);
}

export async function generatePdf(
  images: ImageItem[],
  options: GeneratePdfOptions
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error(
      "At least one image is required to generate a PDF."
    );
  }

  const pdf = await PDFDocument.create();

  const pageDimensions = getPageDimensions(
    options.pageSize,
    options.orientation
  );

  const margin = mmToPoints(options.margin);

  const quality = getProcessingQuality(
    options.quality
  );

  const total = images.length;

  options.onProgress?.({
    current: 0,
    total,
    percentage: 0,
  });

  for (
    let index = 0;
    index < images.length;
    index++
  ) {
    const image = images[index];

    const processed = await processImage(
      image.file,
      {
        rotation: image.rotation,
        outputType: "image/jpeg",
        quality,
      }
    );

    const embeddedImage = await embedImage(
      pdf,
      processed.blob
    );

    const page = pdf.addPage([
      pageDimensions.width,
      pageDimensions.height,
    ]);

    const layout = calculateImageLayout(
      pageDimensions,
      {
        width: embeddedImage.width,
        height: embeddedImage.height,
      },
      margin,
      options.imageFit
    );

    if (options.imageFit === "fill") {
      const contentArea = getContentArea(
        pageDimensions,
        margin
      );

      page.pushOperators(
        pushGraphicsState(),
        rectangle(
          contentArea.x,
          contentArea.y,
          contentArea.width,
          contentArea.height
        ),
        clip(),
        endPath()
      );
    }

    page.drawImage(embeddedImage, {
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
    });

    if (options.imageFit === "fill") {
      page.pushOperators(popGraphicsState());
    }

    const current = index + 1;

    options.onProgress?.({
      current,
      total,
      percentage: Math.round(
        (current / total) * 100
      ),
    });
  }

  const pdfBytes = await pdf.save();

  const pdfBuffer = new ArrayBuffer(
    pdfBytes.byteLength
  );

  new Uint8Array(pdfBuffer).set(pdfBytes);

  return new Blob([pdfBuffer], {
    type: "application/pdf",
  });
}