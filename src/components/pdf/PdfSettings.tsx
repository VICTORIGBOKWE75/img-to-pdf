"use client";

import type { PdfOptions } from "@/types/pdf";

interface PdfSettingsProps {
  options: PdfOptions;
  onChange: (
    options: PdfOptions
  ) => void;
  disabled?: boolean;
}

export function PdfSettings({
  options,
  onChange,
  disabled = false,
}: PdfSettingsProps) {
  function update(
    changes: Partial<PdfOptions>
  ) {
    onChange({
      ...options,
      ...changes,
    });
  }

  return (
    <section className="mt-8 rounded-xl border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          PDF Settings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose how your images should appear in
          the PDF.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pdf-page-size"
            className="mb-2 block text-sm font-medium"
          >
            Page size
          </label>

          <select
            id="pdf-page-size"
            value={options.pageSize}
            disabled={disabled}
            onChange={(event) =>
              update({
                pageSize:
                  event.target
                    .value as PdfOptions["pageSize"],
              })
            }
            className="w-full rounded-lg border bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-sm"
          >
            <option value="A4">
              A4
            </option>

            <option value="LETTER">
              Letter
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="pdf-orientation"
            className="mb-2 block text-sm font-medium"
          >
            Orientation
          </label>

          <select
            id="pdf-orientation"
            value={options.orientation}
            disabled={disabled}
            onChange={(event) =>
              update({
                orientation:
                  event.target
                    .value as PdfOptions["orientation"],
              })
            }
            className="w-full rounded-lg border bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-sm"
          >
            <option value="portrait">
              Portrait
            </option>

            <option value="landscape">
              Landscape
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="pdf-margin"
            className="mb-2 block text-sm font-medium"
          >
            Margin
          </label>

          <div className="flex items-center gap-2">
            <input
              id="pdf-margin"
              type="number"
              min={0}
              max={30}
              step={1}
              value={options.margin}
              disabled={disabled}
              onChange={(event) => {
                const value = Number(
                  event.target.value
                );

                if (!Number.isFinite(value)) {
                  return;
                }

                update({
                  margin: Math.min(
                    30,
                    Math.max(0, value)
                  ),
                });
              }}
              className="w-full rounded-lg border bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-sm"
            />

            <span className="text-sm text-muted-foreground">
              mm
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            0–30 mm
          </p>
        </div>

        <div>
          <label
            htmlFor="pdf-image-fit"
            className="mb-2 block text-sm font-medium"
          >
            Image fit
          </label>

          <select
            id="pdf-image-fit"
            value={options.imageFit}
            disabled={disabled}
            onChange={(event) =>
              update({
                imageFit:
                  event.target
                    .value as PdfOptions["imageFit"],
              })
            }
            className="w-full rounded-lg border bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-sm"
          >
            <option value="fit">
              Fit — show the whole image
            </option>

            <option value="fill">
              Fill — crop to the page area
            </option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="pdf-quality"
            className="mb-2 block text-sm font-medium"
          >
            Quality
          </label>

          <select
            id="pdf-quality"
            value={options.quality}
            disabled={disabled}
            onChange={(event) =>
              update({
                quality:
                  event.target
                    .value as PdfOptions["quality"],
              })
            }
            className="w-full rounded-lg border bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-sm"
          >
            <option value="small">
              Small — smaller PDF
            </option>

            <option value="balanced">
              Balanced — recommended
            </option>

            <option value="high">
              High — better image quality
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}