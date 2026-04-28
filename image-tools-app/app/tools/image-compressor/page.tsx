"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { compressImage } from "@/lib/image/compress";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function getDataUrlSize(dataUrl: string): Promise<number> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob.size;
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      reject(new Error("Could not read image dimensions."));
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  });
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [compressedImage, setCompressedImage] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [quality, setQuality] = useState<string>("0.7");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCompressedImage("");
    setCompressedSize(null);
    setDimensions(null);
    setError("");

    getImageDimensions(selectedFile)
      .then((result) => setDimensions(result))
      .catch(() => setDimensions(null));
  }

  async function handleCompress() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedQuality = Number(quality);

    if (!parsedQuality || parsedQuality <= 0 || parsedQuality > 1) {
      setError("Please enter a quality value between 0.1 and 1.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await compressImage(file, parsedQuality);
      const resultSize = await getDataUrlSize(result);

      setCompressedImage(result);
      setCompressedSize(resultSize);
    } catch {
      setError("Something went wrong while compressing the image.");
    } finally {
      setLoading(false);
    }
  }

  const qualityPercent = useMemo(
    () => Math.round(Number(quality) * 100),
    [quality]
  );

  const originalSize = file ? file.size : null;

  const savedPercentage =
    originalSize && compressedSize
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : null;

  const isReduced =
    originalSize && compressedSize ? compressedSize < originalSize : false;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 rounded-3xl bg-black px-8 py-10 text-white">
          <h1 className="text-4xl font-bold tracking-tight">Image Compressor</h1>
          <p className="mt-3 max-w-2xl text-base text-gray-300">
            Reduce image file size by lowering image quality directly in your browser.
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
                Quality ({qualityPercent}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full"
              />
              <p className="mt-2 text-sm text-gray-500">
                Lower quality usually means smaller file size.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCompress}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                {loading ? "Compressing..." : "Compress Image"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}

            {file && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">File Info</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>
                    Name:{" "}
                    <span className="font-medium text-gray-900">{file.name}</span>
                  </p>
                  <p>
                    Type:{" "}
                    <span className="font-medium text-gray-900">
                      {file.type || "Unknown"}
                    </span>
                  </p>
                  {dimensions && (
                    <p>
                      Dimensions:{" "}
                      <span className="font-medium text-gray-900">
                        {dimensions.width} × {dimensions.height}
                      </span>
                    </p>
                  )}
                  <p>
                    Original size:{" "}
                    <span className="font-medium text-gray-900">
                      {formatFileSize(file.size)}
                    </span>
                  </p>
                </div>
              </div>
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

              {originalSize && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    Size:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatFileSize(originalSize)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Compressed</h2>
                {compressedImage && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isReduced
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isReduced ? "Reduced" : "Generated"}
                  </span>
                )}
              </div>

              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                {compressedImage ? (
                  <img
                    src={compressedImage}
                    alt="Compressed preview"
                    className="max-h-[420px] w-auto max-w-full rounded-xl border border-gray-200 object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Your compressed image will appear here.
                  </p>
                )}
              </div>

              {compressedSize && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Size:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatFileSize(compressedSize)}
                      </span>
                    </p>

                    {savedPercentage && (
                      <p>
                        Reduced by:{" "}
                        <span
                          className={`font-semibold ${
                            isReduced ? "text-green-700" : "text-yellow-700"
                          }`}
                        >
                          {savedPercentage}%
                        </span>
                      </p>
                    )}

                    <p>
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          isReduced ? "text-green-700" : "text-yellow-700"
                        }`}
                      >
                        {isReduced
                          ? "Compression successful"
                          : "File generated, but not smaller"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {compressedImage && (
                <div className="mt-4">
                  <a
                    href={compressedImage}
                    download="compressed-image.jpg"
                    className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                  >
                    Download Compressed Image
/*
test for branch
*/
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