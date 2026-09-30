import type { PdfOptions } from "@/types/pdf";

export const DEFAULT_PDF_OPTIONS: PdfOptions = {
  pageSize: "A4",
  orientation: "portrait",
  margin: 10,
  imageFit: "fit",
  quality: "balanced",
};