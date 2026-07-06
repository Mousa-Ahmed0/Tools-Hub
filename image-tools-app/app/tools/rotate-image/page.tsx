"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import { rotateImage } from "@/lib/image/rotate";
import { revokeObjectUrl } from "@/lib/object-url";

const presetAngles = [90, 180, 270];

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

export default function RotateImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [rotation, setRotation] = useState(0);
  const [customAngle, setCustomAngle] = useState("45");
  const [sliderAngle, setSliderAngle] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setRotation(0);
    setSliderAngle("0");
    setError("");
  }

  function addRotation(degrees: number) {
    setRotation((current) => normalizeDegrees(current + degrees));
    setError("");
  }

  function handleSliderChange(value: string) {
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) return;

    setSliderAngle(value);
    setRotation(normalizeDegrees(parsedValue));
    setError("");
  }

  function handleResetRotation() {
    setRotation(0);
    setSliderAngle("0");
    setError("");
  }

  function handleClear() {
    setFile(null);
    setPreview("");
    setRotation(0);
    setCustomAngle("45");
    setSliderAngle("0");
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleDownload() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await rotateImage(file, rotation);
      const link = document.createElement("a");
      link.href = result;
      link.download = `${getBaseName(file.name)}-rotated-${rotation}.png`;
      link.click();
    } catch {
      setError("Something went wrong while rotating the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <LocalizedText>Rotate Image</LocalizedText>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            <LocalizedText>Rotate Image</LocalizedText>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            <LocalizedText>Upload an image, choose a preset angle or type your own angle, then download the rotated result.</LocalizedText>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <ToolControlsPanel error={error}>
            <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

            <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-black text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
              <LocalizedText>Current rotation</LocalizedText>: {rotation} <LocalizedText>deg</LocalizedText>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-slate-100">
                <LocalizedText>Quick Angles</LocalizedText>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetAngles.map((angle) => (
                  <button
                    key={angle}
                    type="button"
                    onClick={() => addRotation(angle)}
                    className="rounded-2xl bg-[#EEF2FF] px-4 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
                  >
                    {angle}° 
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
                <LocalizedText>Custom Angle</LocalizedText>
              </span>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={customAngle}
                  onChange={(event) => setCustomAngle(event.target.value)}
                  className="min-w-0 flex-1 rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
                />
                <button
                  type="button"
                  onClick={() => addRotation(Number(customAngle))}
                  className="rounded-2xl bg-[#EEF2FF] px-4 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
                >
                  <LocalizedText>Apply</LocalizedText>
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
                <LocalizedText>Custom Angle</LocalizedText>: {sliderAngle}°
              </span>
              <input type="range" min="-180" max="180" value={sliderAngle} onChange={(event) => handleSliderChange(event.target.value)} className="w-full accent-indigo-500" />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button type="button" onClick={handleResetRotation} disabled={!file} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                <LocalizedText>Reset</LocalizedText> <LocalizedText>Current rotation</LocalizedText>
              </button>
              <button type="button" onClick={handleClear} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                <LocalizedText>Clear</LocalizedText>
              </button>
            </div>

            <button type="button" onClick={handleDownload} disabled={!file || loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
              <LocalizedText>{loading ? "Rotating..." : "Download Rotated Image"}</LocalizedText>
            </button>
          </ToolControlsPanel>

          <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
            <div className="flex min-h-[560px] items-center justify-center overflow-auto rounded-3xl bg-[#EEF2FF] p-10 shadow-[inset_6px_6px_14px_#d1d9e6,inset_-6px_-6px_14px_#ffffff] dark:bg-slate-950/40 dark:shadow-[inset_6px_6px_14px_#020617,inset_-6px_-6px_14px_#1e293b]">
              {preview ? (
                <img
                  src={preview}
                  alt="Rotate editor"
                  draggable={false}
                  className="max-h-[420px] max-w-full rounded-2xl object-contain shadow-[5px_5px_14px_#c8d0df,-5px_-5px_14px_#ffffff] transition-transform duration-200 dark:shadow-[5px_5px_14px_#020617,-5px_-5px_14px_#1e293b]"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              ) : (
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Upload Image</LocalizedText></p>
                  <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400"><LocalizedText>Your result will appear here</LocalizedText></p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
