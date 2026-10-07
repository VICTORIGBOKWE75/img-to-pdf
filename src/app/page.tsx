"use client";

import { useEffect, useState } from "react";

import { ImageWorkspace } from "@/components/images/ImageWorkspace";
import { UploadZone } from "@/components/uploader/UploadZone";

import { useImages } from "@/hooks/useImages";
import { usePdfGenerator } from "@/hooks/usePdfGenerator";

import {
  DEFAULT_PDF_OPTIONS,
  downloadPdf,
} from "@/lib/pdf";

import type { PdfOptions } from "@/types/pdf";

export default function Home() {
  const {
    images,
    error: imageError,
    addImages,
    removeImage,
    rotateImage,
    reorderImages,
    clearImages,
  } = useImages();

  const {
    isConverting,
    progress,
    error: pdfError,
    pdfBlob,
    generate,
    reset,
  } = usePdfGenerator();

  const [pdfOptions, setPdfOptions] =
    useState<PdfOptions>(
      DEFAULT_PDF_OPTIONS
    );

  const hasImages = images.length > 0;

  useEffect(() => {
    reset();
  }, [images, pdfOptions, reset]);

  async function handleConvert() {
    await generate(
      images,
      pdfOptions
    );
  }

  function handleDownload() {
    if (!pdfBlob) {
      return;
    }

    downloadPdf(pdfBlob);
  }

  function handleClear() {
    clearImages();
    reset();
  }

  function handleCreateAnother() {
    reset();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const error =
    imageError ?? pdfError;

  console.log(
  "[Home] images:",
  images.length,
  images.map((image) => image.name)
);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <header className="mx-auto max-w-2xl px-2 text-center">
          <p className="text-sm font-medium text-primary">
            Image → PDF
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Convert images to PDF
          </h1>

          <p className="mt-4 text-muted-foreground">
            Convert your images to a PDF directly in
            your browser. Your images never leave your
            device.
          </p>
        </header>

        {!hasImages && (
          <section className="mx-auto mt-10 max-w-3xl">
            <UploadZone
              onFilesSelected={addImages}
            />
          </section>
        )}

        {error && (
          <div
            role="alert"
            className="mx-auto mt-6 max-w-3xl rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {hasImages && (
          <ImageWorkspace
            images={images}
            onFilesSelected={addImages}
            onRotate={rotateImage}
            onRemove={removeImage}
            onReorder={reorderImages}
            onClear={handleClear}
            pdfOptions={pdfOptions}
            onPdfOptionsChange={setPdfOptions}
            isConverting={isConverting}
            progress={progress}
            onConvert={handleConvert}
            pdfBlob={pdfBlob}
            onDownload={handleDownload}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </div>
    </main>
  );
}