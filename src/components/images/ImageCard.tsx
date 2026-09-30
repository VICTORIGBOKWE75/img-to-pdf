"use client";

import type { CSSProperties } from "react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import type { ImageItem } from "@/types/image";

interface ImageCardProps {
  image: ImageItem;
  index: number;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ImageCard({
  image,
  index,
  onRotate,
  onRemove,
}: ImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        "group relative overflow-hidden rounded-xl border",
        "bg-card shadow-sm",
        isDragging
          ? "opacity-60 shadow-lg"
          : "opacity-100",
      ].join(" ")}
    >
      {/* Image number */}
      <div className="absolute left-2 top-2 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-black/70 px-2 text-xs font-medium text-white">
        {index + 1}
      </div>

      {/* Drag handle */}
      <button
        type="button"
        aria-label={`Drag ${image.name} to reorder`}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-black/70 text-white transition hover:bg-black/80 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <span aria-hidden="true">⠿</span>
      </button>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-full w-full object-contain transition-transform duration-200"
          style={{
            transform: `rotate(${image.rotation}deg)`,
          }}
        />
      </div>

      {/* Information */}
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

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRotate(image.id)}
            className="flex-1 rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted"
            aria-label={`Rotate ${image.name}`}
          >
            ↻ Rotate
          </button>

          <button
            type="button"
            onClick={() => onRemove(image.id)}
            className="rounded-md border px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            aria-label={`Delete ${image.name}`}
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  );
}