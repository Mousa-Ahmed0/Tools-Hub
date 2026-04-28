"use client";

import { ChangeEvent, useState } from "react";
import { convertImage } from "@/lib/image/convert";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [convertedImage, setConvertedImage] = useState<string>("");
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setConvertedImage("");
    setError("");
  }

  async function handleConvert() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await convertImage(file, format);
      setConvertedImage(result);
    } catch {
      setError("Something went wrong while converting the image.");
    } finally {
      setLoading(false);
    }
  }

  const downloadName = `converted-image.${format === "jpeg" ? "jpg" : format}`;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 rounded-3xl bg-black px-8 py-10 text-white">
          <h1 className="text-4xl font-bold tracking-tight">Image Converter</h1>
          <p className="mt-3 max-w-2xl text-base text-gray-300">
            Convert image files to PNG, JPG, or WEBP directly in your browser.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Controls</h2>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Output format
              </label>
              <select
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as "png" | "jpeg" | "webp")
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                onClick={handleConvert}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                {loading ? "Converting..." : "Convert Image"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </aside>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Original</h2>
                {file && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Uploaded
                  </span>
                )}
              </div>

              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Original preview"
                    className="max-h-[420px] w-auto max-w-full rounded-xl border border-gray-200 object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Upload an image to preview it here.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Converted</h2>
                {convertedImage && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Ready
                  </span>
                )}
              </div>

              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                {convertedImage ? (
                  <img
                    src={convertedImage}
                    alt="Converted preview"
                    className="max-h-[420px] w-auto max-w-full rounded-xl border border-gray-200 object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Your converted image will appear here.
                  </p>
                )}
              </div>

              {convertedImage && (
                <div className="mt-4">
                  <a
                    href={convertedImage}
                    download={downloadName}
                    className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                  >
                    Download Converted Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}