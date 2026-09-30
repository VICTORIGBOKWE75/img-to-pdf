export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const MAX_IMAGES = 30;

export const MAX_IMAGE_DIMENSION = 12000;

export const MAX_IMAGE_PIXELS = 40_000_000;

export function isSupportedImageType(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(
    file.type as (typeof SUPPORTED_IMAGE_TYPES)[number]
  );
}

export function validateImageFile(
  file: File
): string | null {
  if (!file || file.size === 0) {
    return "The selected file is empty.";
  }

  if (!isSupportedImageType(file)) {
    return "Unsupported image type. Please use JPG, PNG, or WebP.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image is too large. Maximum file size is 20MB.";
  }

  return null;
}

export function validateImageCount(
  currentCount: number,
  incomingCount: number
): string | null {
  if (currentCount + incomingCount > MAX_IMAGES) {
    return `You can upload a maximum of ${MAX_IMAGES} images.`;
  }

  return null;
}

export function validateImageDimensions(
  width: number,
  height: number
): string | null {
  if (width <= 0 || height <= 0) {
    return "Image dimensions are invalid.";
  }

  if (
    width > MAX_IMAGE_DIMENSION ||
    height > MAX_IMAGE_DIMENSION
  ) {
    return "Image dimensions are too large.";
  }

  if (width * height > MAX_IMAGE_PIXELS) {
    return "Image contains too many pixels.";
  }

  return null;
}