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
import { yieldToBrowser } from "@/lib/image/yieldToBrowser";

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

interface GeneratePdfOptions
  extends PdfOptions {
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
  const bytes =
    new Uint8Array(
      await blob.arrayBuffer()
    );

  if (blob.type === "image/png") {
    return pdf.embedPng(bytes);
  }

  if (blob.type === "image/jpeg") {
    return pdf.embedJpg(bytes);
  }

  throw new Error(
    `Unsupported processed image format: ${blob.type}`
  );
}

function validatePdfOptions(
  options: PdfOptions
): void {
  if (
    !Number.isFinite(
      options.margin
    )
  ) {
    throw new Error(
      "The PDF margin is invalid."
    );
  }

  if (
    options.margin < 0 ||
    options.margin > 30
  ) {
    throw new Error(
      "The PDF margin must be between 0 and 30 mm."
    );
  }
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

  validatePdfOptions(options);

  const pdf =
    await PDFDocument.create();

  const pageDimensions =
    getPageDimensions(
      options.pageSize,
      options.orientation
    );

  const margin =
    mmToPoints(options.margin);

  const quality =
    getProcessingQuality(
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

    try {
      const processed =
        await processImage(
          image.file,
          {
            rotation:
              image.rotation,
            outputType:
              "image/jpeg",
            quality,
          }
        );

      const embeddedImage =
        await embedImage(
          pdf,
          processed.blob
        );

      const page =
        pdf.addPage([
          pageDimensions.width,
          pageDimensions.height,
        ]);

      const layout =
        calculateImageLayout(
          pageDimensions,
          {
            width:
              embeddedImage.width,
            height:
              embeddedImage.height,
          },
          margin,
          options.imageFit
        );

      if (
        options.imageFit ===
        "fill"
      ) {
        const contentArea =
          getContentArea(
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

      page.drawImage(
        embeddedImage,
        {
          x: layout.x,
          y: layout.y,
          width: layout.width,
          height: layout.height,
        }
      );

      if (
        options.imageFit ===
        "fill"
      ) {
        page.pushOperators(
          popGraphicsState()
        );
      }

      const current =
        index + 1;

      options.onProgress?.({
        current,
        total,
        percentage: Math.round(
          (current / total) * 100
        ),
      });

      /*
       * Give the browser a chance to
       * process input, paint progress,
       * and perform garbage collection
       * between images.
       */
      if (
        current < total
      ) {
        await yieldToBrowser();
      }
    } catch (error) {
      const filename =
        image.name ||
        `image ${index + 1}`;

      throw new Error(
        `Could not process "${filename}". ${
          error instanceof Error
            ? error.message
            : "Please try another image."
        }`
      );
    }
  }

const pdfBytes = await pdf.save();

const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
new Uint8Array(pdfBuffer).set(pdfBytes);

return new Blob([pdfBuffer], {
  type: "application/pdf",
});
}