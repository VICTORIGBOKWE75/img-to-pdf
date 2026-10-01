"use client";

interface PdfSuccessProps {
  pdfBlob: Blob;
  onDownload: () => void;
  onCreateAnother: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  const megabytes = kilobytes / 1024;

  return `${megabytes.toFixed(2)} MB`;
}

export function PdfSuccess({
  pdfBlob,
  onDownload,
  onCreateAnother,
}: PdfSuccessProps) {
  return (
    <section
      className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5"
      aria-live="polite"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-hidden="true"
            >
              ✓
            </div>

            <h2 className="text-lg font-semibold">
              PDF ready
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Your PDF was created successfully on your
            device.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            File size: {formatFileSize(pdfBlob.size)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onDownload}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Download PDF
          </button>

          <button
            type="button"
            onClick={onCreateAnother}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            Create Another
          </button>
        </div>
      </div>
    </section>
  );
}