import { getExifRotation } from "./exif";

import {
  canvasToBlob,
  type ImageOutputFormat,
} from "./compress";

import { decodeImage } from "./decode";

import {
  calculateResizedDimensions,
  type ImageDimensions,
} from "./resize";

import {
  drawRotatedImage,
  getRotatedDimensions,
  type ImageRotation,
} from "./rotate";

export const MAX_OUTPUT_WIDTH = 4096;
export const MAX_OUTPUT_HEIGHT = 4096;

export interface ProcessImageOptions {
  rotation?: ImageRotation;
  outputType?: ImageOutputFormat;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  type: string;
}

function combineRotations(
  exifRotation: ImageRotation,
  userRotation: ImageRotation
): ImageRotation {
  return ((exifRotation + userRotation) % 360) as ImageRotation;
}

export async function processImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<ProcessedImage> {
  const {
    rotation: userRotation = 0,
    outputType = "image/jpeg",
    quality = 0.9,
    maxWidth = MAX_OUTPUT_WIDTH,
    maxHeight = MAX_OUTPUT_HEIGHT,
  } = options;

  const [{ image, width, height }, exifRotation] =
    await Promise.all([
      decodeImage(file),
      getExifRotation(file),
    ]);

  const rotation = combineRotations(
    exifRotation,
    userRotation
  );

  const rotatedDimensions = getRotatedDimensions(
    { width, height },
    rotation
  );

  const outputDimensions = calculateResizedDimensions(
    rotatedDimensions.width,
    rotatedDimensions.height,
    {
      maxWidth,
      maxHeight,
    }
  );

  const canvas = document.createElement("canvas");

  canvas.width = outputDimensions.width;
  canvas.height = outputDimensions.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const scaleX =
    outputDimensions.width / rotatedDimensions.width;

  const scaleY =
    outputDimensions.height / rotatedDimensions.height;

  context.save();

  context.scale(scaleX, scaleY);

  drawRotatedImage(
    context,
    image,
    width,
    height,
    rotation
  );

  context.restore();

  const blob = await canvasToBlob(canvas, {
    type: outputType,
    quality:
      outputType === "image/png"
        ? undefined
        : quality,
  });

  return {
    blob,
    width: outputDimensions.width,
    height: outputDimensions.height,
    type: blob.type,
  };
}