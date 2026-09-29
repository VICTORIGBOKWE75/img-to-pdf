"use client";

import { useState } from "react";
import { ImageItem } from "@/types/image";
import { getImageDimensions } from "@/lib/image/decode";
import {
  validateImageCount,
  validateImageFile,
} from "@/lib/image/validate";

export function useImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function addImages(files: File[]) {
    setError(null);

    const countError = validateImageCount(images.length, files.length);

    if (countError) {
      setError(countError);
      return;
    }

    const validFiles = files.filter((file) => {
      const error = validateImageFile(file);
      return !error;
    });

    if (validFiles.length === 0) {
      setError("No supported images were selected.");
      return;
    }

    const newImages: ImageItem[] = [];

    for (const file of validFiles) {
      try {
        const { width, height } = await getImageDimensions(file);

        newImages.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          width,
          height,
          rotation: 0,
          previewUrl: URL.createObjectURL(file),
          status: "ready",
        });
      } catch {
        // Ignore images that cannot be decoded.
      }
    }

    setImages((current) => [...current, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  }

  function clearImages() {
    images.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });

    setImages([]);
  }

  return {
    images,
    error,
    addImages,
    removeImage,
    clearImages,
  };
}