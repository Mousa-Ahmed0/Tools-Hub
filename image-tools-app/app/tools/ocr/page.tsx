"use client";

import { ChangeEvent, useState } from "react";
import { extractTextFromImage } from "@/lib/image/ocr";

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setExtractedText("");
    setCopied(false);
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setExtractedText("");
    setCopied(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleExtractText() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const text = await extractTextFromImage(file);

      setExtractedText(text || "No text was detected in this image.");
    } catch {
      setError("Something went wrong while extracting text from the image.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyText() {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setError("");
    } catch {
      setError("Could not copy the extracted text.");
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            OCR Image to Text
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image and extract readable text directly in your browser.
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
                onClick={handleExtractText}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Extracting..." : "Extract Text"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || extractedText) && (
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
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Extracted Text
                  </h2>

                  {extractedText && (
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="inline-flex rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      {copied ? "Copied" : "Copy Text"}
                    </button>
                  )}
                </div>

                <div className="min-h-[260px] rounded-xl border border-gray-200 bg-gray-50 p-4">
                  {extractedText ? (
                    <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                      {extractedText}
                    </pre>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Extracted text will appear here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
