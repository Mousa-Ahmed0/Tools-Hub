"use client";

import { ChangeEvent, useState } from "react";
import { ImageMetadata, getImageMetadata } from "@/lib/image/metadata";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export default function MetadataViewerPage() {
  const [preview, setPreview] = useState("");
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      setError("");
      setMetadata(null);
      setPreview(URL.createObjectURL(selectedFile));

      const result = await getImageMetadata(selectedFile);
      setMetadata(result);
    } catch {
      setError("Could not read metadata from this image.");
    }
  }

  function handleReset() {
    setPreview("");
    setMetadata(null);
    setError("");
    setInputKey((current) => current + 1);
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Image Metadata Viewer
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image to view its file details, dimensions, and type.
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

            <div className="mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || metadata) && (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {preview && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Image Preview
                  </h2>
                  <img
                    src={preview}
                    alt="Uploaded preview"
                    className="w-full rounded-xl border border-gray-200"
                  />
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Metadata
                </h2>

                {metadata ? (
                  <dl className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
                    <div>
                      <dt className="font-semibold text-gray-900">File name</dt>
                      <dd className="mt-1 break-words text-gray-600">
                        {metadata.fileName}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">File size</dt>
                      <dd className="mt-1 text-gray-600">
                        {formatFileSize(metadata.fileSize)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">Dimensions</dt>
                      <dd className="mt-1 text-gray-600">
                        {metadata.width} x {metadata.height}px
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">Image type</dt>
                      <dd className="mt-1 text-gray-600">
                        {metadata.imageType}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">
                        Last modified
                      </dt>
                      <dd className="mt-1 text-gray-600">
                        {formatDate(metadata.lastModified)}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Image metadata will appear here.
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
