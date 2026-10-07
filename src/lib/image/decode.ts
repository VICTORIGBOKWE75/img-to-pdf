export interface DecodedImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

function waitForImageLoad(
  image: HTMLImageElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    function handleLoad() {
      cleanup();
      resolve();
    }

    function handleError() {
      cleanup();
      reject(
        new Error("The image could not be loaded.")
      );
    }

    function cleanup() {
      image.removeEventListener(
        "load",
        handleLoad
      );
      image.removeEventListener(
        "error",
        handleError
      );
    }

    image.addEventListener(
      "load",
      handleLoad,
      { once: true }
    );

    image.addEventListener(
      "error",
      handleError,
      { once: true }
    );
  });
}

export async function decodeImage(
  file: File
): Promise<DecodedImage> {
  const objectUrl =
    URL.createObjectURL(file);

  const image = new Image();

  image.decoding = "async";

  try {
    image.src = objectUrl;

    /*
     * Some mobile browsers can have problems with
     * HTMLImageElement.decode() for blob URLs.
     *
     * The load event is more broadly supported, so
     * use it as the primary decoding mechanism.
     */
    await waitForImageLoad(image);

    if (
      !image.naturalWidth ||
      !image.naturalHeight
    ) {
      throw new Error(
        "Image has invalid dimensions."
      );
    }

    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } catch (error) {
    console.error(
      "Image decoding failed:",
      error
    );

    throw new Error(
      "The image could not be decoded."
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function getImageDimensions(
  file: File
): Promise<{
  width: number;
  height: number;
}> {
  const decoded =
    await decodeImage(file);

  return {
    width: decoded.width,
    height: decoded.height,
  };
}
