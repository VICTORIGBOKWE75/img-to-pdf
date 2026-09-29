"use client";

import { ImageGrid } from "@/components/images/ImageGrid";
import { UploadZone } from "@/components/uploader/UploadZone";
import { useImages } from "@/hooks/useImages";

export default function Home() {
  const {
    images,
    error,
    addImages,
  } = useImages();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">
            Image → PDF
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Convert images to PDF
          </h1>

          <p className="mt-4 text-muted-foreground">
            Convert your images to a PDF directly in your
            browser. Your images never leave your device.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-3xl">
          <UploadZone onFilesSelected={addImages} />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              {error}
            </div>
          )}
        </section>

        <ImageGrid images={images} />
      </div>
    </main>
  );
}