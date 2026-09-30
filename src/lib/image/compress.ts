export type ImageOutputFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp";

export interface CompressOptions {
  type: ImageOutputFormat;
  quality?: number;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  options: CompressOptions
): Promise<Blob> {
  const quality =
    options.quality === undefined
      ? undefined
      : Math.min(1, Math.max(0, options.quality));

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      options.type,
      quality
    );
  });

  if (!blob) {
    throw new Error("The image could not be encoded.");
  }

  return blob;
}