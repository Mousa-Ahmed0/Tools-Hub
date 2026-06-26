"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { removeBackgroundColor } from "@/lib/image/background-color-remover";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function BackgroundColorRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("background-color-removed.png");
  const [inputKey, setInputKey] = useState(0);

  const toleranceValue = useMemo(() => Number(tolerance), [tolerance]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setProcessedImage("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-bg-removed.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setProcessedImage("");
    setBackgroundColor("#ffffff");
    setTolerance("20");
    setError("");
    setDownloadFileName("background-color-removed.png");
    setInputKey((current) => current + 1);
  }

  async function handleRemoveColor() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    if (Number.isNaN(toleranceValue) || toleranceValue < 0 || toleranceValue > 100) {
      setError("Please choose a tolerance between 0 and 100.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await removeBackgroundColor(
        file,
        backgroundColor,
        toleranceValue
      );

      setProcessedImage(result);
      setDownloadFileName(`${getBaseName(file.name)}-bg-removed.png`);
    } catch {
      setError("Something went wrong while removing the selected color.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Background Color Remover
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, choose a background color, and make matching pixels transparent.
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

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Background Color
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => {
                    setBackgroundColor(e.target.value);
                    setProcessedImage("");
                  }}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-2 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Tolerance ({tolerance})
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={tolerance}
                  onChange={(e) => {
                    setTolerance(e.target.value);
                    setProcessedImage("");
                  }}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Higher tolerance removes colors that are close to the selected color.
                </p>
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
                onClick={handleRemoveColor}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Removing Color..." : "Remove Color"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || processedImage) && (
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
                  Processed Image
                </h2>
                {processedImage ? (
                  <>
                    <div className="rounded-xl border border-gray-200 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3">
                      <img
                        src={processedImage}
                        alt="Processed preview"
                        className="w-full rounded-lg"
                      />
                    </div>

                    <div className="mt-4">
                      <a
                        href={processedImage}
                        download={downloadFileName}
                        className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                      >
                        Download PNG
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Your transparent PNG preview will appear here.
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
