"use client";

import { ChangeEvent, useState } from "react";
import { rotateImage } from "@/lib/image/rotate";

const presetAngles = [90, 180, 270];

export default function RotateImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [rotatedImage, setRotatedImage] = useState<string>("");
  const [degrees, setDegrees] = useState<string>("90");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("rotated-image.png");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreview(objectUrl);
    setRotatedImage("");
    setError("");
    setDegrees("90");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-rotated.png`);
  }

  function handleReset() {
    setDegrees("90");
    setRotatedImage("");
    setError("");
  }

  async function handleRotate() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedDegrees = Number(degrees);

    if (Number.isNaN(parsedDegrees)) {
      setError("Please enter a valid rotation angle.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await rotateImage(file, parsedDegrees);

      const normalizedDegrees = ((parsedDegrees % 360) + 360) % 360;
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(`${originalName}-rotated-${normalizedDegrees}.png`);

      setRotatedImage(result);
    } catch {
      setError("Something went wrong while rotating the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Rotate Image
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, choose a preset angle or type your own angle, then download the rotated result.
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
                Quick Angles
              </label>

              <div className="flex flex-wrap gap-3">
                {presetAngles.map((angle) => (
                  <button
                    key={angle}
                    type="button"
                    onClick={() => setDegrees(String(angle))}
                    className={`inline-flex rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      degrees === String(angle)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Custom Angle
              </label>

              <input
                type="number"
                value={degrees}
                onChange={(e) => setDegrees(e.target.value)}
                placeholder="Enter angle, e.g. 45"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
              />

              <p className="mt-2 text-sm text-gray-500">
                You can enter any angle, such as 45, 120, or 270.
              </p>
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
                onClick={handleRotate}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Rotating..." : "Rotate Image"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || rotatedImage) && (
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

              {rotatedImage && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Rotated Image
                  </h2>
                  <img
                    src={rotatedImage}
                    alt="Rotated preview"
                    className="w-full rounded-xl border border-gray-200"
                  />

                  <div className="mt-4">
                    <a
                      href={rotatedImage}
                      download={downloadFileName}
                      className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Download Rotated Image
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