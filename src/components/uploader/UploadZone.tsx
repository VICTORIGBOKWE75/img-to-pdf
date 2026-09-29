"use client";

import {
  type DragEvent,
  useState,
} from "react";

import { FilePicker } from "./FilePicker";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function UploadZone({
  onFilesSelected,
  disabled = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget as Node | null;

    if (
      relatedTarget &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    setIsDragging(false);

    if (disabled) {
      return;
    }

    const files = Array.from(event.dataTransfer.files);

    onFilesSelected(files);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "flex min-h-72 w-full flex-col items-center justify-center",
        "rounded-2xl border-2 border-dashed p-8",
        "transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 bg-muted/20",
        disabled
          ? "pointer-events-none opacity-60"
          : "",
      ].join(" ")}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 text-4xl" aria-hidden="true">
          🖼️
        </div>

        <h2 className="text-xl font-semibold">
          {isDragging
            ? "Drop your images here"
            : "Drop images here"}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Or choose images from your device
        </p>

        <div className="mt-5">
          <FilePicker
            onFilesSelected={onFilesSelected}
            disabled={disabled}
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          JPG, PNG, and WebP · Up to 20 MB per image ·
          Maximum 30 images
        </p>
      </div>
    </div>
  );
}