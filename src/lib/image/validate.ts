const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_IMAGES = 30;

export function validateImageFile(file: File): string | null {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported image format.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image is too large. Maximum size is 20 MB.";
  }

  return null;
}

export function validateImageCount(
  currentCount: number,
  incomingCount: number
): string | null {
  if (currentCount + incomingCount > MAX_IMAGES) {
    return `You can add up to ${MAX_IMAGES} images.`;
  }

  return null;
}