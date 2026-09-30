"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

interface FilePickerProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FilePicker({
  onFilesSelected,
  disabled = false,
}: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {    
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files) {
      return;
    }

    onFilesSelected(Array.from(files));

    // Allows selecting the same file again later.
    event.target.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={handleFileChange}
        disabled={disabled}
      />

      <Button
        type="button"
        onClick={openFilePicker}
        disabled={disabled}
      >
        Choose Images
      </Button>
    </>
  );
}