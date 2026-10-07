"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import type { ImageItem } from "@/types/image";

import { getImageDimensions } from "@/lib/image/decode";
import {
  MAX_IMAGES,
  validateImageDimensions,
  validateImageFile,
} from "@/lib/image/validate";

interface AddImagesResult {
  added: number;
  rejected: number;
}

export function useImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  /*
   * Keeps track of the latest image count even while
   * asynchronous image decoding is in progress.
   */
  const imageCountRef = useRef(0);

  const addImages = useCallback(
    async (
      files: File[]
    ): Promise<AddImagesResult> => {
      setError(null);

      if (files.length === 0) {
        return {
          added: 0,
          rejected: 0,
        };
      }

      const currentCount =
        imageCountRef.current;

      const availableSlots =
        MAX_IMAGES - currentCount;

      if (availableSlots <= 0) {
        setError(
          `You already have the maximum of ${MAX_IMAGES} images.`
        );

        return {
          added: 0,
          rejected: files.length,
        };
      }

      const filesToProcess = files.slice(
        0,
        availableSlots
      );

      let rejectedFiles =
        files.length - filesToProcess.length;

      const newImages: ImageItem[] = [];

      for (const file of filesToProcess) {
        const validationError =
          validateImageFile(file);

        if (validationError) {
          rejectedFiles += 1;
          continue;
        }

        try {
          const { width, height } =
            await getImageDimensions(file);

          const dimensionError =
            validateImageDimensions(
              width,
              height
            );

          if (dimensionError) {
            rejectedFiles += 1;
            continue;
          }

          const image: ImageItem = {
            id: crypto.randomUUID(),
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            width,
            height,
            rotation: 0,
            previewUrl:
              URL.createObjectURL(file),
            status: "ready",
          };

          newImages.push(image);
        } catch (error) {
          console.error(
            "Failed to add image:",
            file.name,
            error
          );

          rejectedFiles += 1;
        }
      }

      if (newImages.length > 0) {
        setImages((currentImages) => {
          const remainingSlots =
            MAX_IMAGES -
            currentImages.length;

          const imagesToAdd =
            newImages.slice(0, remainingSlots);

          /*
           * If another add operation completed while
           * these images were being decoded, don't exceed
           * the maximum image count.
           */
          if (
            imagesToAdd.length <
            newImages.length
          ) {
            const imagesToDiscard =
              newImages.slice(
                imagesToAdd.length
              );

            for (const image of imagesToDiscard) {
              URL.revokeObjectURL(
                image.previewUrl
              );
            }

            rejectedFiles +=
              imagesToDiscard.length;
          }

          const updatedImages = [
            ...currentImages,
            ...imagesToAdd,
          ];

          imageCountRef.current =
            updatedImages.length;

          return updatedImages;
        });
      }

      if (rejectedFiles > 0) {
        setError(
          `${rejectedFiles} image${
            rejectedFiles === 1
              ? ""
              : "s"
          } could not be added.`
        );
      }

      return {
        added: newImages.length,
        rejected: rejectedFiles,
      };
    },
    []
  );

  const removeImage = useCallback(
    (id: string) => {
      setImages((currentImages) => {
        const imageToRemove =
          currentImages.find(
            (image) => image.id === id
          );

        if (imageToRemove) {
          URL.revokeObjectURL(
            imageToRemove.previewUrl
          );
        }

        const updatedImages =
          currentImages.filter(
            (image) => image.id !== id
          );

        imageCountRef.current =
          updatedImages.length;

        return updatedImages;
      });
    },
    []
  );

  const rotateImage = useCallback(
    (id: string) => {
      setImages((currentImages) =>
        currentImages.map((image) => {
          if (image.id !== id) {
            return image;
          }

          const nextRotation =
            ((image.rotation + 90) %
              360) as
              | 0
              | 90
              | 180
              | 270;

          return {
            ...image,
            rotation: nextRotation,
          };
        })
      );
    },
    []
  );

  const reorderImages = useCallback(
    (
      activeId: string,
      overId: string
    ) => {
      setImages((currentImages) => {
        const oldIndex =
          currentImages.findIndex(
            (image) =>
              image.id === activeId
          );

        const newIndex =
          currentImages.findIndex(
            (image) =>
              image.id === overId
          );

        if (
          oldIndex === -1 ||
          newIndex === -1 ||
          oldIndex === newIndex
        ) {
          return currentImages;
        }

        const updatedImages = [
          ...currentImages,
        ];

        const [movedImage] =
          updatedImages.splice(
            oldIndex,
            1
          );

        updatedImages.splice(
          newIndex,
          0,
          movedImage
        );

        return updatedImages;
      });
    },
    []
  );

  const clearImages = useCallback(() => {
    setImages((currentImages) => {
      for (const image of currentImages) {
        URL.revokeObjectURL(
          image.previewUrl
        );
      }

      imageCountRef.current = 0;

      return [];
    });

    setError(null);
  }, []);

  return {
    images,
    error,
    addImages,
    removeImage,
    rotateImage,
    reorderImages,
    clearImages,
    setError,
  };
}
