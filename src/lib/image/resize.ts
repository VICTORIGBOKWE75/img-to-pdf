export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
}


//hope you wont cause an issue
export const MAX_OUTPUT_WIDTH = 4096;
export const MAX_OUTPUT_HEIGHT = 4096;

export function calculateResizedDimensions(
  width: number,
  height: number,
  options: ResizeOptions
): ImageDimensions {
  if (width <= 0 || height <= 0) {
    throw new Error("Invalid image dimensions.");
  }

  const widthRatio = options.maxWidth / width;
  const heightRatio = options.maxHeight / height;

  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}