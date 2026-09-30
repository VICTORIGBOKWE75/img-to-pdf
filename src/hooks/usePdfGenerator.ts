"use client";

import { useCallback, useState } from "react";

import type { ImageItem } from "@/types/image";
import {
  DEFAULT_PDF_OPTIONS,
  generatePdf,
} from "@/lib/pdf";

interface UsePdfGeneratorResult {
  isConverting: boolean;
  progress: number;
  error: string | null;
  pdfBlob: Blob | null;
  generate: (images: ImageItem[]) => Promise<Blob | null>;
  reset: () => void;
}

export function usePdfGenerator(): UsePdfGeneratorResult {
  const [isConverting, setIsConverting] =
    useState(false);

  const [progress, setProgress] = useState(0);

  const [error, setError] = useState<string | null>(
    null
  );

  const [pdfBlob, setPdfBlob] =
    useState<Blob | null>(null);

  const generate = useCallback(
    async (
      images: ImageItem[]
    ): Promise<Blob | null> => {
      if (images.length === 0) {
        setError(
          "Add at least one image before creating a PDF."
        );

        return null;
      }

      setIsConverting(true);
      setProgress(0);
      setError(null);
      setPdfBlob(null);

      try {
        const blob = await generatePdf(
          images,
          {
            ...DEFAULT_PDF_OPTIONS,

            onProgress: ({
              percentage,
            }) => {
              setProgress(percentage);
            },
          }
        );

        setPdfBlob(blob);

        return blob;
      } catch (error) {
        console.error(
          "PDF generation failed:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the PDF."
        );

        return null;
      } finally {
        setIsConverting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsConverting(false);
    setProgress(0);
    setError(null);
    setPdfBlob(null);
  }, []);

  return {
    isConverting,
    progress,
    error,
    pdfBlob,
    generate,
    reset,
  };
}