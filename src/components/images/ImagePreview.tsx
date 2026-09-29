"use client";

import type { ImageItem } from "@/types/image";

interface ImagePreviewProps {
  image: ImageItem;
}

export function ImagePreview({
  image,
}: ImagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-3">
        <p
          className="truncate text-sm font-medium"
          title={image.name}
        >
          {image.name}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {image.width} × {image.height}
        </p>
      </div>
    </div>
  );
}