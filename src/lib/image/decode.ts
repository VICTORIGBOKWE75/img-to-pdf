export interface DecodedImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export async function decodeImage(file: File): Promise<DecodedImage> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();

    image.decoding = "async";
    image.src = objectUrl;

    await image.decode();

    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("Image has invalid dimensions.");
    }

    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } catch {
    throw new Error("The image could not be decoded.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const decoded = await decodeImage(file);

  return {
    width: decoded.width,
    height: decoded.height,
  };
}