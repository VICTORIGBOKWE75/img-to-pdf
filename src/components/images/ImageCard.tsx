"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import type { ImageItem } from "@/types/image";

interface ImageCardProps {
  image: ImageItem;
  index: number;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  destructive?: boolean;
}

function ActionButton({
  label,
  onClick,
  children,
  destructive = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={[
        "flex h-10 w-10 items-center justify-center rounded-lg",
        "border bg-background/95 text-sm shadow-sm backdrop-blur",
        "transition hover:bg-muted",
        "active:scale-95",
        destructive
          ? "text-destructive hover:bg-destructive/10"
          : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
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

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
    touchAction: "pan-y",
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        "relative overflow-hidden rounded-xl border bg-card",
        isDragging
          ? "z-10 opacity-60 shadow-xl"
          : "shadow-sm",
      ].join(" ")}
    >
      <div
        {...attributes}
        {...listeners}
        className="relative aspect-square cursor-grab touch-pan-y overflow-hidden bg-muted active:cursor-grabbing"
        aria-label={`Drag image ${index + 1} to reorder`}
      >
        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-full w-full object-contain"
          style={{
            transform: `rotate(${image.rotation}deg)`,
          }}
          draggable={false}
        />

        <div className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-background/90 px-2 text-xs font-semibold shadow-sm">
          {index + 1}
        </div>

        <div
          className="absolute bottom-2 right-2 flex gap-2"
          onPointerDown={(event) =>
            event.stopPropagation()
          }
        >
          <ActionButton
            label="Rotate image"
            onClick={() =>
              onRotate(image.id)
            }
          >
            ↻
          </ActionButton>

          <ActionButton
            label="Remove image"
            onClick={() =>
              onRemove(image.id)
            }
            destructive
          >
            ×
          </ActionButton>
        </div>
      </div>

      <div className="border-t px-3 py-2">
        <p
          className="truncate text-xs font-medium"
          title={image.name}
        >
          {image.name}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {image.width} × {image.height}
        </p>
      </div>
    </article>
  );
}