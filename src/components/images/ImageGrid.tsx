"use client";

import type { ImageItem } from "@/types/image";

import { ImagePreview } from "./ImagePreview";

interface ImageGridProps {
  images: ImageItem[];
}

export function ImageGrid({
  images,
}: ImageGridProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Your images
          </h2>

          <p className="text-sm text-muted-foreground">
            {images.length}{" "}
            {images.length === 1 ? "image" : "images"} selected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <ImagePreview
            key={image.id}
            image={image}
          />
        ))}
      </div>
    </section>
  );
}