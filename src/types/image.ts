export type ImageStatus =
  | "pending"
  | "processing"
  | "ready"
  | "error";

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  previewUrl: string;
  status: ImageStatus;
  error?: string;
}