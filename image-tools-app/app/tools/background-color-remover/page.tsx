"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { removeBackgroundColor } from "@/lib/image/background-color-remover";
import { revokeObjectUrl } from "@/lib/object-url";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function BackgroundColorRemoverPage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [eyedropperEnabled, setEyedropperEnabled] = useState(false);
  const [tolerance, setTolerance] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("background-color-removed.png");
  const [inputKey, setInputKey] = useState(0);

  const toleranceValue = useMemo(() => Number(tolerance), [tolerance]);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setProcessedImage("");
    setError("");
    setEyedropperEnabled(false);
    setDownloadFileName(`${getBaseName(selectedFile.name)}-bg-removed.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setProcessedImage("");
    setBackgroundColor("#ffffff");
    setEyedropperEnabled(false);
    setTolerance("20");
    setError("");
    setDownloadFileName("background-color-removed.png");
    setInputKey((current) => current + 1);
  }

  async function handleRemoveColor() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    if (Number.isNaN(toleranceValue) || toleranceValue < 0 || toleranceValue > 100) {
      setError("Please choose a tolerance between 0 and 100.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await removeBackgroundColor(file, backgroundColor, toleranceValue);
      setProcessedImage(result);
      setDownloadFileName(`${getBaseName(file.name)}-bg-removed.png`);
    } catch {
      setError("Something went wrong while removing the selected color.");
    } finally {
      setLoading(false);
    }
  }

  function rgbToHex(red: number, green: number, blue: number) {
    return `#${[red, green, blue]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function handleImagePick(event: PointerEvent<HTMLImageElement>) {
    if (!eyedropperEnabled || !imageRef.current) return;

    try {
      const image = imageRef.current;
      const rect = image.getBoundingClientRect();
      const scaleX = image.naturalWidth / rect.width;
      const scaleY = image.naturalHeight / rect.height;
      const pixelX = Math.min(
        image.naturalWidth - 1,
        Math.max(0, Math.floor((event.clientX - rect.left) * scaleX))
      );
      const pixelY = Math.min(
        image.naturalHeight - 1,
        Math.max(0, Math.floor((event.clientY - rect.top) * scaleY))
      );
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");

      if (!context) {
        setError("Could not read color from this image.");
        return;
      }

      context.drawImage(image, 0, 0);
      const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;
      setBackgroundColor(rgbToHex(pixel[0], pixel[1], pixel[2]));
      setProcessedImage("");
      setEyedropperEnabled(false);
      setError("");
    } catch {
      setError("Could not pick a color from this image.");
    }
  }

  return (
    <ToolPageShell
      title="Background Color Remover"
      description="Upload an image, choose a background color, and make matching pixels transparent."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            key={inputKey}
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Background Color</LocalizedText></span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  setProcessedImage("");
                }}
                className="h-12 w-full rounded-2xl border-0 bg-[#EEF2FF] dark:bg-slate-900 px-2 py-2 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Tolerance</LocalizedText> ({tolerance})</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={tolerance}
                onChange={(e) => {
                  setTolerance(e.target.value);
                  setProcessedImage("");
                }}
                className="w-full accent-indigo-500"
              />
              <span className="mt-2 block text-sm font-medium text-slate-500 dark:text-slate-400">
                <LocalizedText>Higher tolerance removes colors close to the selected color.</LocalizedText>
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => setEyedropperEnabled((current) => !current)}
            className={`rounded-2xl px-5 py-3 text-sm font-bold shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition ${
              eyedropperEnabled
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                : "bg-[#EEF2FF] dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-indigo-600"
            }`}
          >
            <LocalizedText>{eyedropperEnabled ? "Click Image to Pick Color" : "Pick Color from Image"}</LocalizedText>
          </button>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="inline-flex rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600">
              <LocalizedText>Reset</LocalizedText>
            </button>
          </div>
          <button type="button" onClick={handleRemoveColor} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            <LocalizedText>{loading ? "Removing Color..." : "Remove Color"}</LocalizedText>
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && (
          <img
            ref={imageRef}
            src={preview}
            alt="Original preview"
            onPointerDown={handleImagePick}
            className={`max-h-[520px] w-auto max-w-full rounded-2xl object-contain ${
              eyedropperEnabled ? "cursor-crosshair ring-4 ring-indigo-300" : ""
            }`}
          />
        )}
      </PreviewPanel>

      <ResultPanel
        title="Processed Image"
        downloadHref={processedImage}
        downloadName={downloadFileName}
        downloadLabel="Download PNG"
        emptyText="Your transparent PNG preview will appear here."
      >
        {processedImage && (
          <div className="rounded-2xl bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3">
            <img src={processedImage} alt="Processed preview" className="max-h-[520px] w-auto max-w-full rounded-xl object-contain" />
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}

