"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  GeneratedFaviconImage,
  generateFavicons,
} from "@/lib/image/favicon";

export default function FaviconGeneratorPage() {
  const [preview, setPreview] = useState("");
  const [faviconImages, setFaviconImages] = useState<GeneratedFaviconImage[]>(
    []
  );
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const icoUrl = useMemo(() => {
    if (!icoBlob) return "";
    return URL.createObjectURL(icoBlob);
  }, [icoBlob]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setPreview(URL.createObjectURL(selectedFile));
    setFaviconImages([]);
    setIcoBlob(null);
    setError("");

    handleGenerate(selectedFile);
  }

  function handleReset() {
    setPreview("");
    setFaviconImages([]);
    setIcoBlob(null);
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleGenerate(file: File) {
    try {
      setLoading(true);
      setError("");

      const result = await generateFavicons(file);

      setFaviconImages(result.images);
      setIcoBlob(result.icoBlob);
    } catch {
      setError("Something went wrong while generating the favicon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Favicon Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image and generate favicon PNG previews plus a favicon.ico file.
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

              {icoUrl && (
                <a
                  href={icoUrl}
                  download="favicon.ico"
                  className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Download favicon.ico
                </a>
              )}
            </div>

            {loading && (
              <p className="mt-4 text-sm font-medium text-gray-600">
                Generating favicon files...
              </p>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || faviconImages.length > 0) && (
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
                  Favicon Preview
                </h2>

                {faviconImages.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {faviconImages.map((image) => (
                      <div
                        key={image.size}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center"
                      >
                        <div className="flex h-20 items-center justify-center rounded-lg bg-white">
                          <img
                            src={image.dataUrl}
                            alt={`${image.size} by ${image.size} favicon`}
                            width={image.size}
                            height={image.size}
                            className="border border-gray-200"
                          />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-gray-900">
                          {image.size} x {image.size}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Generated favicon previews will appear here.
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
