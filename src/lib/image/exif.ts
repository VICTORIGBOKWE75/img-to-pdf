import exifr from "exifr";

import type { ImageRotation } from "./rotate";

export async function getExifRotation(
  file: File
): Promise<ImageRotation> {
  try {
    const orientation = await exifr.orientation(file);

    switch (orientation) {
      case 6:
        return 90;

      case 3:
        return 180;

      case 8:
        return 270;

      default:
        return 0;
    }
  } catch {
    return 0;
  }
}