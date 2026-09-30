import type { ImageDimensions } from "./resize";

export type ImageRotation = 0 | 90 | 180 | 270;

export function getRotatedDimensions(
  dimensions: ImageDimensions,
  rotation: ImageRotation
): ImageDimensions {
  if (rotation === 90 || rotation === 270) {
    return {
      width: dimensions.height,
      height: dimensions.width,
    };
  }

  return dimensions;
}

export function drawRotatedImage(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  rotation: ImageRotation
): void {
  switch (rotation) {
    case 90:
      context.translate(height, 0);
      context.rotate(Math.PI / 2);
      break;

    case 180:
      context.translate(width, height);
      context.rotate(Math.PI);
      break;

    case 270:
      context.translate(0, width);
      context.rotate(-Math.PI / 2);
      break;

    case 0:
      break;
  }

  context.drawImage(image, 0, 0, width, height);
}