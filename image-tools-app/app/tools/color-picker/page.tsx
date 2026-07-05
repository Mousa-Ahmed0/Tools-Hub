"use client";

import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PickedColor, getImagePixelColor } from "@/lib/image/color-picker";

export default function ColorPickerPage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [selectedColor, setSelectedColor] = useState<PickedColor | null>(null);
  const [copiedValue, setCopiedValue] = useState("");
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const rgbValue = selectedColor
    ? `rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`
    : "";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setSelectedColor(null);
    setCopiedValue("");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setSelectedColor(null);
    setCopiedValue("");
    setError("");
    setInputKey((current) => current + 1);
  }

  function handleImageClick(event: MouseEvent<HTMLImageElement>) {
    if (!imageRef.current) {
      setError("Please upload an image first.");
      return;
    }

    try {
      const color = getImagePixelColor(imageRef.current, event.clientX, event.clientY);
      setSelectedColor(color);
      setCopiedValue("");
      setError("");
    } catch {
      setError("Could not read the selected pixel color.");
    }
  }

  async function handleCopy(value: string) {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setError("");
    } catch {
      setError("Could not copy the selected color.");
    }
  }

  return (
    <ToolPageShell
      title="Color Picker"
      description="Upload an image, click any pixel, and copy the selected color as HEX or RGB."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            key={inputKey}
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex w-fit rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600"
          >
            Reset
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Image Preview">
        {preview && (
          <img
            ref={imageRef}
            src={preview}
            alt="Uploaded preview"
            onClick={handleImageClick}
            className="max-h-[520px] w-auto max-w-full cursor-crosshair rounded-2xl object-contain"
          />
        )}
      </PreviewPanel>

      <ResultPanel title="Selected Color" emptyText="Click the image preview to select a color.">
        {selectedColor && (
          <div className="w-full rounded-3xl bg-white/70 p-4">
            <div
              className="h-28 rounded-2xl shadow-[inset_4px_4px_8px_rgba(15,23,42,0.12),inset_-4px_-4px_8px_rgba(255,255,255,0.45)]"
              style={{ backgroundColor: selectedColor.hex }}
              aria-label={`Selected color ${selectedColor.hex}`}
            />
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                HEX: <span className="font-mono font-bold text-slate-900">{selectedColor.hex}</span>
              </p>
              <p>
                RGB: <span className="font-mono font-bold text-slate-900">{rgbValue}</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => handleCopy(selectedColor.hex)} className="inline-flex rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">
                {copiedValue === selectedColor.hex ? "Copied HEX" : "Copy HEX"}
              </button>
              <button type="button" onClick={() => handleCopy(rgbValue)} className="inline-flex rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">
                {copiedValue === rgbValue ? "Copied RGB" : "Copy RGB"}
              </button>
            </div>
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}
