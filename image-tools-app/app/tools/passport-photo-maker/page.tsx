"use client";

import { ChangeEvent, useState } from "react";
import {
  PassportPhotoPresetKey,
  createPassportPhoto,
  passportPhotoPresets,
} from "@/lib/image/passport-photo";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function PassportPhotoMakerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [passportPhoto, setPassportPhoto] = useState("");
  const [selectedPresetKey, setSelectedPresetKey] =
    useState<PassportPhotoPresetKey>("us-passport");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState(
    "passport-photo.png"
  );
  const [inputKey, setInputKey] = useState(0);

  const selectedPreset =
    passportPhotoPresets.find((preset) => preset.key === selectedPresetKey) ??
    passportPhotoPresets[0];

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPassportPhoto("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-passport-photo.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setPassportPhoto("");
    setSelectedPresetKey("us-passport");
    setError("");
    setDownloadFileName("passport-photo.png");
    setInputKey((current) => current + 1);
  }

  async function handleGenerate() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await createPassportPhoto(file, selectedPreset);

      setPassportPhoto(result);
      setDownloadFileName(`${getBaseName(file.name)}-passport-photo.png`);
    } catch {
      setError("Something went wrong while creating the passport photo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Passport Photo Maker
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload an image, choose a photo size, and create a white-background PNG.
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
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Photo Size
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {passportPhotoPresets.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => {
                      setSelectedPresetKey(preset.key);
                      setPassportPhoto("");
                    }}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      selectedPresetKey === preset.key
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div>{preset.label}</div>
                    <div className="mt-1 text-xs opacity-80">
                      {preset.description}
                    </div>
                    <div className="mt-1 text-xs opacity-80">
                      {preset.width} x {preset.height}px
                    </div>
                  </button>
                ))}
              </div>
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
                type="button"
                onClick={handleGenerate}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Generating..." : "Generate Photo"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {(preview || passportPhoto) && (
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
                  Generated Photo
                </h2>

                {passportPhoto ? (
                  <>
                    <img
                      src={passportPhoto}
                      alt="Generated passport photo"
                      className="w-full rounded-xl border border-gray-200"
                    />

                    <div className="mt-4">
                      <a
                        href={passportPhoto}
                        download={downloadFileName}
                        className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                      >
                        Download PNG
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Your generated passport photo will appear here.
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
