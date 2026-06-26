"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  WatermarkPosition,
  watermarkImage,
} from "@/lib/image/watermark";

const positions: { label: string; value: WatermarkPosition }[] = [
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
  { label: "Center", value: "center" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
];

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function ImageWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [watermarkedImage, setWatermarkedImage] = useState("");
  const [text, setText] = useState("Image Tools Hub");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState("0.6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("48");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("watermarked-image.png");
  const [inputKey, setInputKey] = useState(0);

  const opacityPercent = useMemo(
    () => Math.round(Number(opacity) * 100),
    [opacity]
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setWatermarkedImage("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-watermark.png`);
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    setLogoFile(selectedFile);
    setWatermarkedImage("");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setLogoFile(null);
    setPreview("");
    setWatermarkedImage("");
    setText("Image Tools Hub");
    setPosition("bottom-right");
    setOpacity("0.6");
    setTextColor("#ffffff");
    setFontSize("48");
    setError("");
    setDownloadFileName("watermarked-image.png");
    setInputKey((current) => current + 1);
  }

  async function handleWatermark() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedOpacity = Number(opacity);
    const parsedFontSize = Number(fontSize);

    if (Number.isNaN(parsedOpacity) || parsedOpacity < 0.1 || parsedOpacity > 1) {
      setError("Please choose an opacity between 10% and 100%.");
      return;
    }

    if (!parsedFontSize || parsedFontSize < 8 || parsedFontSize > 240) {
      setError("Please enter a font size between 8 and 240.");
      return;
    }

    if (!text.trim() && !logoFile) {
      setError("Add watermark text or upload a logo image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await watermarkImage(file, {
        text,
        logoFile,
        position,
        opacity: parsedOpacity,
        textColor,
        fontSize: parsedFontSize,
      });

      setWatermarkedImage(result);
      setDownloadFileName(`${getBaseName(file.name)}-watermark.png`);
    } catch {
      setError("Something went wrong while adding the watermark.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Image Watermark
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, add a text or logo watermark, preview it, and download a PNG result.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Upload Image
            </label>

            <input
              key={`image-${inputKey}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setWatermarkedImage("");
                  }}
                  placeholder="Enter watermark text"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Optional Logo Watermark
                </label>
                <input
                  key={`logo-${inputKey}`}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-900 hover:file:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value as WatermarkPosition);
                    setWatermarkedImage("");
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                >
                  {positions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    setWatermarkedImage("");
                  }}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-2 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Font Size
                </label>
                <input
                  type="number"
                  min="8"
                  max="240"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    setWatermarkedImage("");
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Opacity ({opacityPercent}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(e.target.value);
                    setWatermarkedImage("");
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleWatermark}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Adding Watermark..." : "Add Watermark"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || watermarkedImage) && (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {preview && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Original Preview
                  </h2>
                  <img
                    src={preview}
                    alt="Original preview"
                    className="w-full rounded-xl border border-gray-200"
                  />
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Watermarked Image
                </h2>
                {watermarkedImage ? (
                  <>
                    <img
                      src={watermarkedImage}
                      alt="Watermarked preview"
                      className="w-full rounded-xl border border-gray-200"
                    />

                    <div className="mt-4">
                      <a
                        href={watermarkedImage}
                        download={downloadFileName}
                        className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                      >
                        Download Watermarked Image
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Your watermarked image will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
