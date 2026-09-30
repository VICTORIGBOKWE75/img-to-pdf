export type PdfPageSize = "A4" | "LETTER";

export type PdfOrientation =
  | "portrait"
  | "landscape";

export type PdfImageFit =
  | "fit"
  | "fill";

export type PdfQuality =
  | "small"
  | "balanced"
  | "high";

export interface PdfOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  margin: number;
  imageFit: PdfImageFit;
  quality: PdfQuality;
}