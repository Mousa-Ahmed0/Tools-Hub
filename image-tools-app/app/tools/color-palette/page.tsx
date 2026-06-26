"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  PaletteColor,
  extractColorPalette,
} from "@/lib/image/color-palette";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function ColorPalettePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [copiedHex, setCopiedHex] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const paletteFileName = file
    ? `${getBaseName(file.name)}-palette.json`
    : "color-palette.json";

  const paletteJson = useMemo(
    () =>
      JSON.stringify(
        palette.map((color) => ({
          hex: color.hex,
          rgb: color.rgb,
          count: color.count,
        })),
        null,
        2
      ),
    [palette]
  );

  const paletteDownloadUrl = useMemo(() => {
    if (!palette.length) return "";

    const blob = new Blob([paletteJson], { type: "application/json" });
    return URL.createObjectURL(blob);
  }, [palette.length, paletteJson]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPalette([]);
    setCopiedHex("");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setPalette([]);
    setCopiedHex("");
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleExtractPalette() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopiedHex("");

      const result = await extractColorPalette(file, 5);

      if (!result.length) {
        setError("No visible colors could be extracted from this image.");
        return;
      }

      setPalette(result);
    } catch {
      setError("Something went wrong while extracting the color palette.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
    } catch {
      setError("Could not copy the HEX code.");
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Color Palette Extractor
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image and extract the top five dominant colors as copyable HEX codes.
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
                onClick={handleExtractPalette}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Extracting..." : "Extract Palette"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || palette.length > 0) && (
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
                  Dominant Colors
                </h2>

                {palette.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {palette.map((color) => (
                        <div
                          key={color.hex}
                          className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                        >
                          <div
                            className="h-12 w-16 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                            aria-label={`Color ${color.hex}`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-sm font-semibold text-gray-900">
                              {color.hex}
                            </p>
                            <p className="text-xs text-gray-500">
                              RGB {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(color.hex)}
                            className="inline-flex rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white"
                          >
                            {copiedHex === color.hex ? "Copied" : "Copy"}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <a
                        href={paletteDownloadUrl}
                        download={paletteFileName}
                        className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                      >
                        Download JSON
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Your extracted palette will appear here.
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
