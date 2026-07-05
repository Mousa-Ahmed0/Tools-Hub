"use client";

import { ChangeEvent, useState } from "react";
import { removeImageExif } from "@/lib/image/exif-remover";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function ExifRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [cleanedImage, setCleanedImage] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("cleaned-image.png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCleanedImage("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-exif-removed.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setCleanedImage("");
    setDownloadFileName("cleaned-image.png");
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleRemoveExif() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await removeImageExif(file);
      setCleanedImage(result);
      setDownloadFileName(`${getBaseName(file.name)}-exif-removed.png`);
    } catch {
      setError("Something went wrong while removing metadata from the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            EXIF Remover
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image and create a clean PNG by redrawing it without embedded metadata.
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

              <button
                type="button"
                onClick={handleRemoveExif}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Cleaning..." : "Remove EXIF"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || cleanedImage) && (
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
                  Cleaned Image
                </h2>

                {cleanedImage ? (
                  <>
                    <img
                      src={cleanedImage}
                      alt="Cleaned preview"
                      className="w-full rounded-xl border border-gray-200"
                    />

                    <div className="mt-4">
                      <a
                        href={cleanedImage}
                        download={downloadFileName}
                        className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                      >
                        Download Cleaned PNG
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Your cleaned image will appear here.
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
