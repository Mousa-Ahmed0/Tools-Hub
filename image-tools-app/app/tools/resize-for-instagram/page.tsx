"use client";

import { ChangeEvent, useState } from "react";
import { resizeForCanvasFit } from "@/lib/image/resize-for-social";

type InstagramPreset = {
  key: string;
  label: string;
  width: number;
  height: number;
};

const presets: InstagramPreset[] = [
  { key: "square", label: "Instagram Square", width: 1080, height: 1080 },
  { key: "portrait", label: "Instagram Portrait", width: 1080, height: 1350 },
  { key: "landscape", label: "Instagram Landscape", width: 1080, height: 566 },
  { key: "story", label: "Instagram Story", width: 1080, height: 1920 },
];

export default function ResizeForInstagramPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resizedImage, setResizedImage] = useState<string>("");
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("square");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("instagram-image.png");

  const selectedPreset =
    presets.find((preset) => preset.key === selectedPresetKey) ?? presets[0];

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreview(objectUrl);
    setResizedImage("");
    setError("");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-${selectedPreset.key}.png`);
  }

  function handleReset() {
    setSelectedPresetKey("square");
    setResizedImage("");
    setError("");

    if (file) {
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(`${originalName}-square.png`);
    }
  }

  async function handleResize() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await resizeForCanvasFit(
        file,
        selectedPreset.width,
        selectedPreset.height
      );

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(
        `${originalName}-${selectedPreset.width}x${selectedPreset.height}.png`
      );

      setResizedImage(result);
    } catch {
      setError("Something went wrong while resizing the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Resize for Instagram
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, choose an Instagram format, and download the resized result.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Instagram Preset
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {presets.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setSelectedPresetKey(preset.key)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      selectedPresetKey === preset.key
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div>{preset.label}</div>
                    <div className="mt-1 text-xs opacity-80">
                      {preset.width} × {preset.height}
                    </div>
                  </button>
                ))}
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
                onClick={handleResize}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Resizing..." : "Resize for Instagram"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || resizedImage) && (
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

              {resizedImage && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Resized Image
                  </h2>
                  <img
                    src={resizedImage}
                    alt="Instagram resized preview"
                    className="w-full rounded-xl border border-gray-200"
                  />

                  <div className="mt-4">
                    <a
                      href={resizedImage}
                      download={downloadFileName}
                      className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Download Image
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}