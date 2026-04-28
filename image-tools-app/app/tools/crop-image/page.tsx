"use client";

import { ChangeEvent, useState } from "react";
import { cropImage } from "@/lib/image/crop";

export default function CropImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [x, setX] = useState<string>("0");
  const [y, setY] = useState<string>("0");
  const [cropWidth, setCropWidth] = useState<string>("200");
  const [cropHeight, setCropHeight] = useState<string>("200");
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("cropped-image.png");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();

    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setX("0");
      setY("0");
      setCropWidth(String(Math.min(200, img.width)));
      setCropHeight(String(Math.min(200, img.height)));
    };

    img.src = objectUrl;

    setFile(selectedFile);
    setPreview(objectUrl);
    setCroppedImage("");
    setError("");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-cropped.png`);
  }

  async function handleCrop() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedX = Number(x);
    const parsedY = Number(y);
    const parsedCropWidth = Number(cropWidth);
    const parsedCropHeight = Number(cropHeight);

    if (
      parsedX < 0 ||
      parsedY < 0 ||
      !parsedCropWidth ||
      !parsedCropHeight ||
      parsedCropWidth <= 0 ||
      parsedCropHeight <= 0
    ) {
      setError("Please enter valid crop values.");
      return;
    }

    if (
      originalWidth &&
      originalHeight &&
      (parsedX + parsedCropWidth > originalWidth ||
        parsedY + parsedCropHeight > originalHeight)
    ) {
      setError("Crop area exceeds image boundaries.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await cropImage(
        file,
        parsedX,
        parsedY,
        parsedCropWidth,
        parsedCropHeight
      );

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(
        `${originalName}-crop-${parsedCropWidth}x${parsedCropHeight}.png`
      );

      setCroppedImage(result);
    } catch {
      setError("Something went wrong while cropping the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Crop Image
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, set crop values, and download the cropped result.
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

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  X
                </label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Y
                </label>
                <input
                  type="number"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Width
                </label>
                <input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => setCropWidth(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Height
                </label>
                <input
                  type="number"
                  value={cropHeight}
                  onChange={(e) => setCropHeight(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCrop}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Cropping..." : "Crop Image"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || croppedImage) && (
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

              {croppedImage && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Cropped Image
                  </h2>
                  <img
                    src={croppedImage}
                    alt="Cropped preview"
                    className="w-full rounded-xl border border-gray-200"
                  />

                  <div className="mt-4">
                    <a
                      href={croppedImage}
                      download={downloadFileName}
                      className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Download Cropped Image
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