"use client";

interface ConvertButtonProps {
  disabled?: boolean;
  isConverting: boolean;
  progress: number;
  onClick: () => void;
}

export function ConvertButton({
  disabled = false,
  isConverting,
  progress,
  onClick,
}: ConvertButtonProps) {
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isConverting}
        className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isConverting
          ? `Creating PDF… ${progress}%`
          : "Convert to PDF"}
      </button>

      {isConverting && (
        <div className="mt-4">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="PDF conversion progress"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Processing your images locally…
          </p>
        </div>
      )}
    </div>
  );
}