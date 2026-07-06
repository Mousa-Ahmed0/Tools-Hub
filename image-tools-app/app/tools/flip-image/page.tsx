"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import { revokeObjectUrl } from "@/lib/object-url";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not load image."));
      image.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

async function renderFlippedImage(file: File, horizontal: boolean, vertical: boolean) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Could not create canvas context.");

  context.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
  context.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  context.drawImage(image, 0, 0);

  return canvas.toDataURL("image/png");
}

export default function FlipImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [flippedHorizontal, setFlippedHorizontal] = useState(false);
  const [flippedVertical, setFlippedVertical] = useState(false);
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
    setFlippedHorizontal(false);
    setFlippedVertical(false);
    setError("");
  }

  function handleResetFlip() {
    setFlippedHorizontal(false);
    setFlippedVertical(false);
    setError("");
  }

  function handleClear() {
    setFile(null);
    setPreview("");
    setFlippedHorizontal(false);
    setFlippedVertical(false);
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
      const result = await renderFlippedImage(file, flippedHorizontal, flippedVertical);
      const stateLabel =
        flippedHorizontal && flippedVertical
          ? "horizontal-vertical"
          : flippedHorizontal
          ? "horizontal"
          : flippedVertical
          ? "vertical"
          : "original";
      const link = document.createElement("a");
      link.href = result;
      link.download = `${getBaseName(file.name)}-flipped-${stateLabel}.png`;
      link.click();
    } catch {
      setError("Something went wrong while flipping the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <LocalizedText>Flip Image</LocalizedText>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            <LocalizedText>Flip Image</LocalizedText>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            <LocalizedText>Upload an image, choose a flip direction, and download the result.</LocalizedText>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <ToolControlsPanel error={error}>
            <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

            <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-black text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
              <LocalizedText>Status</LocalizedText>:{" "}
              {flippedHorizontal ? <LocalizedText>horizontal</LocalizedText> : <LocalizedText>Original</LocalizedText>}
              {flippedVertical ? " + " : ""}
              {flippedVertical && <LocalizedText>vertical</LocalizedText>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button type="button" onClick={() => setFlippedHorizontal((current) => !current)} className={`rounded-2xl px-5 py-3 text-sm font-bold shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] ${flippedHorizontal ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-[#EEF2FF] text-slate-700 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200"}`}>
                <LocalizedText>horizontal</LocalizedText>
              </button>
              <button type="button" onClick={() => setFlippedVertical((current) => !current)} className={`rounded-2xl px-5 py-3 text-sm font-bold shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] ${flippedVertical ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-[#EEF2FF] text-slate-700 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200"}`}>
                <LocalizedText>vertical</LocalizedText>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button type="button" onClick={handleResetFlip} disabled={!file} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                <LocalizedText>Reset</LocalizedText> <LocalizedText>Flip Image</LocalizedText>
              </button>
              <button type="button" onClick={handleClear} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                <LocalizedText>Clear</LocalizedText>
              </button>
            </div>

            <button type="button" onClick={handleDownload} disabled={!file || loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
              <LocalizedText>{loading ? "Flipping..." : "Download Flipped Image"}</LocalizedText>
            </button>
          </ToolControlsPanel>

          <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
            <div className="flex min-h-[560px] items-center justify-center overflow-auto rounded-3xl bg-[#EEF2FF] p-10 shadow-[inset_6px_6px_14px_#d1d9e6,inset_-6px_-6px_14px_#ffffff] dark:bg-slate-950/40 dark:shadow-[inset_6px_6px_14px_#020617,inset_-6px_-6px_14px_#1e293b]">
              {preview ? (
                <img
                  src={preview}
                  alt="Flip editor"
                  draggable={false}
                  className="max-h-[420px] max-w-full rounded-2xl object-contain shadow-[5px_5px_14px_#c8d0df,-5px_-5px_14px_#ffffff] transition-transform duration-200 dark:shadow-[5px_5px_14px_#020617,-5px_-5px_14px_#1e293b]"
                  style={{ transform: `scale(${flippedHorizontal ? -1 : 1}, ${flippedVertical ? -1 : 1})` }}
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
