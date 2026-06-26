"use client";

import { useState } from "react";
import { generateQrCode } from "@/lib/image/qr-code";

export default function QrCodeGeneratorPage() {
  const [inputValue, setInputValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleReset() {
    setInputValue("");
    setQrCode("");
    setError("");
  }

  async function handleGenerate() {
    if (!inputValue.trim()) {
      setError("Please enter text or a URL first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await generateQrCode(inputValue);
      setQrCode(result);
    } catch {
      setError("Something went wrong while generating the QR code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            QR Code Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Enter text or a URL, generate a QR code, and download it as a PNG.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Text or URL
            </label>

            <textarea
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                setQrCode("");
                setError("");
              }}
              rows={5}
              placeholder="https://example.com"
              className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
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
                onClick={handleGenerate}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              QR Preview
            </h2>

            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="Generated QR code"
                  className="h-auto w-full max-w-[320px] rounded-xl border border-gray-200 bg-white"
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Your generated QR code will appear here.
                </p>
              )}
            </div>

            {qrCode && (
              <div className="mt-4">
                <a
                  href={qrCode}
                  download="qr-code.png"
                  className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  Download QR Code
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
