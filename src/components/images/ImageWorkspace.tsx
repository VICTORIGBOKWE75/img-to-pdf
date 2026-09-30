"use client";

import { useRef } from "react";

import type { ImageItem } from "@/types/image";

import { ImageGrid } from "./ImageGrid";

interface ImageWorkspaceProps {
  images: ImageItem[];
  onFilesSelected: (files: File[]) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onClear: () => void;
}

export function ImageWorkspace({
  images,
  onFilesSelected,
  onRotate,
  onRemove,
  onReorder,
  onClear,
}: ImageWorkspaceProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files) {
      return;
    }

    onFilesSelected(Array.from(files));

    // Allow selecting the same file again.
    event.target.value = "";
  }

  const imageLabel =
    images.length === 1 ? "image" : "images";

  return (
    <section className="mt-10">
      {/* Hidden file input for "Add Images" */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={handleFileChange}
      />

      {/* Workspace header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Images
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {images.length} {imageLabel} selected
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openFilePicker}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            + Add Images
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Image grid */}
      <ImageGrid
        images={images}
        onRotate={onRotate}
        onRemove={onRemove}
        onReorder={onReorder}
      />
    </section>
  );
}