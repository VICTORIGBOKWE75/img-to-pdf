
"use client";

import { useId } from "react";

import type { ImageItem } from "@/types/image";
import type { PdfOptions } from "@/types/pdf";

import { ConvertButton } from "@/components/pdf/ConvertButton";
import { PdfSettings } from "@/components/pdf/PdfSettings";
import { PdfSuccess } from "@/components/pdf/PdfSuccess";

import { ImageGrid } from "./ImageGrid";

interface ImageWorkspaceProps {
  images: ImageItem[];
  onFilesSelected: (files: File[]) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (
    activeId: string,
    overId: string
  ) => void;
  onClear: () => void;

  pdfOptions: PdfOptions;
  onPdfOptionsChange: (
    options: PdfOptions
  ) => void;

  isConverting: boolean;
  progress: number;
  onConvert: () => void;

  pdfBlob: Blob | null;
  onDownload: () => void;
  onCreateAnother: () => void;
}

export function ImageWorkspace({
  images,
  onFilesSelected,
  onRotate,
  onRemove,
  onReorder,
  onClear,
  pdfOptions,
  onPdfOptionsChange,
  isConverting,
  progress,
  onConvert,
  pdfBlob,
  onDownload,
  onCreateAnother,
}: ImageWorkspaceProps) {
  const inputId = useId();

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files) {
      return;
    }

    onFilesSelected(Array.from(files));

    // Allows selecting the same file again later.
    event.target.value = "";
  }

  const imageLabel =
    images.length === 1 ? "image" : "images";

  return (
    <section className="mt-8 sm:mt-10">
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={handleFileChange}
        disabled={isConverting}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Images
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {images.length} {imageLabel} selected
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={inputId}
            className={[
              "rounded-lg border px-4 py-2",
              "text-sm font-medium transition",
              isConverting
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-muted",
            ].join(" ")}
          >
            + Add Images
          </label>

          <button
            type="button"
            onClick={onClear}
            disabled={isConverting}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <ImageGrid
        images={images}
        onRotate={onRotate}
        onRemove={onRemove}
        onReorder={onReorder}
      />

      <PdfSettings
        options={pdfOptions}
        onChange={onPdfOptionsChange}
        disabled={isConverting}
      />

      <ConvertButton
        isConverting={isConverting}
        progress={progress}
        disabled={images.length === 0}
        onClick={onConvert}
      />

      {pdfBlob && !isConverting && (
        <PdfSuccess
          pdfBlob={pdfBlob}
          onDownload={onDownload}
          onCreateAnother={onCreateAnother}
        />
      )}
    </section>
  );
}
