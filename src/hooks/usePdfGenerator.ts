"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import type { ImageItem } from "@/types/image";
import type { PdfOptions } from "@/types/pdf";

import {
  DEFAULT_PDF_OPTIONS,
  generatePdf,
} from "@/lib/pdf";

interface UsePdfGeneratorResult {
  isConverting: boolean;
  progress: number;
  error: string | null;
  pdfBlob: Blob | null;
  generate: (
    images: ImageItem[],
    options?: PdfOptions
  ) => Promise<Blob | null>;
  reset: () => void;
}

export function usePdfGenerator(): UsePdfGeneratorResult {
  const [isConverting, setIsConverting] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [error, setError] =
    useState<string | null>(null);

  const [pdfBlob, setPdfBlob] =
    useState<Blob | null>(null);

  const generationId =
    useRef(0);

  const generate = useCallback(
    async (
      images: ImageItem[],
      options: PdfOptions =
        DEFAULT_PDF_OPTIONS
    ): Promise<Blob | null> => {
      if (images.length === 0) {
        setError(
          "Add at least one image before creating a PDF."
        );

        return null;
      }

      const currentGeneration =
        ++generationId.current;

      setIsConverting(true);
      setProgress(0);
      setError(null);
      setPdfBlob(null);

      try {
        const blob =
          await generatePdf(
            images,
            {
              ...options,

              onProgress: ({
                percentage,
              }) => {
                if (
                  currentGeneration !==
                  generationId.current
                ) {
                  return;
                }

                setProgress(
                  percentage
                );
              },
            }
          );

        if (
          currentGeneration !==
          generationId.current
        ) {
          return null;
        }

        setPdfBlob(blob);

        return blob;
      } catch (error) {
        if (
          currentGeneration !==
          generationId.current
        ) {
          return null;
        }

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
        if (
          currentGeneration ===
          generationId.current
        ) {
          setIsConverting(
            false
          );
        }
      }
    },
    []
  );

  const reset = useCallback(() => {
    generationId.current += 1;

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