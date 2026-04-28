"use client";

import { ChangeEvent, useState } from "react";
import { resizeImage } from "@/lib/image/resize";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resizedImage, setResizedImage] = useState<string>("");
  const [width, setWidth] = useState<string>("800");
  const [height, setHeight] = useState<string>("600");
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("resized-image.png");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();

    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(String(img.width));
      setHeight(String(img.height));
    };

    img.src = objectUrl;

    setFile(selectedFile);
    setPreview(objectUrl);
    setResizedImage("");
    setError("");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-resized.png`);
  }

  function handleWidthChange(value: string) {
    setWidth(value);

    if (!keepAspectRatio || !originalWidth || !originalHeight) return;
    if (!value) {
      setHeight("");
      return;
    }

    const nextWidth = Number(value);
    if (!nextWidth || nextWidth <= 0) return;

    const nextHeight = Math.round((nextWidth * originalHeight) / originalWidth);
    setHeight(String(nextHeight));
  }

  function handleHeightChange(value: string) {
    setHeight(value);

    if (!keepAspectRatio || !originalWidth || !originalHeight) return;
    if (!value) {
      setWidth("");
      return;
    }

    const nextHeight = Number(value);
    if (!nextHeight || nextHeight <= 0) return;

    const nextWidth = Math.round((nextHeight * originalWidth) / originalHeight);
    setWidth(String(nextWidth));
  }

  function handleSwapDimensions() {
    setWidth(height);
    setHeight(width);
  }

  async function handleResize() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    if (!parsedWidth || !parsedHeight || parsedWidth <= 0 || parsedHeight <= 0) {
      setError("Please enter valid width and height.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await resizeImage(file, parsedWidth, parsedHeight);

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(`${originalName}-${parsedWidth}x${parsedHeight}.png`);

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
            Image Resizer
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, set custom dimensions, and download the resized result.
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

            {originalWidth && originalHeight && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                Original size:{" "}
                <span className="font-semibold">
                  {originalWidth} × {originalHeight}px
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <input
                id="keep-aspect-ratio"
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label
                htmlFor="keep-aspect-ratio"
                className="text-sm font-medium text-gray-700"
              >
                Keep aspect ratio
              </label>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Width
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Height
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSwapDimensions}
                className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Swap Dimensions
              </button>

              <button
                onClick={handleResize}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Resizing..." : "Resize Image"}
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
                    alt="Resized preview"
                    className="w-full rounded-xl border border-gray-200"
                  />

                  <div className="mt-4">
                    <a
                      href={resizedImage}
                      download={downloadFileName}
                      className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Download Resized Image
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