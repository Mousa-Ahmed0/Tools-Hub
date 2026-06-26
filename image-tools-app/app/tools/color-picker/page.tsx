"use client";

import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import {
  PickedColor,
  getImagePixelColor,
} from "@/lib/image/color-picker";

export default function ColorPickerPage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
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

    setPreview(URL.createObjectURL(selectedFile));
    setSelectedColor(null);
    setCopiedValue("");
    setError("");
  }

  function handleReset() {
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
      const color = getImagePixelColor(
        imageRef.current,
        event.clientX,
        event.clientY
      );

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
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Color Picker
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, click any pixel, and copy the selected color as HEX or RGB.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Upload Image
            </label>

            <input
              key={inputKey}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Image Preview
              </h2>

              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                {preview ? (
                  <img
                    ref={imageRef}
                    src={preview}
                    alt="Uploaded preview"
                    onClick={handleImageClick}
                    className="max-h-[520px] w-auto max-w-full cursor-crosshair rounded-xl border border-gray-200 object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Upload an image to start picking colors.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Selected Color
              </h2>

              {selectedColor ? (
                <>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div
                      className="h-28 rounded-xl border border-gray-200"
                      style={{ backgroundColor: selectedColor.hex }}
                      aria-label={`Selected color ${selectedColor.hex}`}
                    />

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p>
                        HEX:{" "}
                        <span className="font-mono font-semibold text-gray-900">
                          {selectedColor.hex}
                        </span>
                      </p>
                      <p>
                        RGB:{" "}
                        <span className="font-mono font-semibold text-gray-900">
                          {rgbValue}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedColor.hex)}
                      className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      {copiedValue === selectedColor.hex
                        ? "Copied HEX"
                        : "Copy HEX"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(rgbValue)}
                      className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      {copiedValue === rgbValue ? "Copied RGB" : "Copy RGB"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Click the image preview to select a color.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
