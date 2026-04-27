"use client";

import { ChangeEvent, useState } from "react";
import { resizeImage } from "@/lib/image/resize";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resizedImage, setResizedImage] = useState<string>("");
  const [width, setWidth] = useState<string>("800");
  const [height, setHeight] = useState<string>("600");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResizedImage("");
    setError("");
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
      setResizedImage(result);
    } catch {
      setError("Something went wrong while resizing the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Image Resizer
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          Upload an image, set custom dimensions, and download the resized result.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
          />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Width
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Height
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleResize}
              className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {loading ? "Resizing..." : "Resize Image"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
          )}
        </div>

        {(preview || resizedImage) && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {preview && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Original Image
                  </h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Before
                  </span>
                </div>

                <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <img
                    src={preview}
                    alt="Original preview"
                    className="max-h-80 rounded-lg object-contain"
                  />
                </div>
              </div>
            )}

            {resizedImage && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Resized Image
                  </h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    After
                  </span>
                </div>

                <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <img
                    src={resizedImage}
                    alt="Resized preview"
                    className="max-h-80 rounded-lg object-contain"
                  />
                </div>

                <div className="mt-5 ">
                  <a
                    href={resizedImage}
                    download="resized-image.png"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    Download Resized Image
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}