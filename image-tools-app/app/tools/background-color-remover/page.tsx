"use client";

import { ChangeEvent, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { removeBackgroundColor } from "@/lib/image/background-color-remover";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function BackgroundColorRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("background-color-removed.png");
  const [inputKey, setInputKey] = useState(0);

  const toleranceValue = useMemo(() => Number(tolerance), [tolerance]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setProcessedImage("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-bg-removed.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setProcessedImage("");
    setBackgroundColor("#ffffff");
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
              <span className="mb-2 block text-sm font-bold text-slate-900">Background Color</span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  setProcessedImage("");
                }}
                className="h-12 w-full rounded-2xl border-0 bg-[#EEF2FF] px-2 py-2 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Tolerance ({tolerance})</span>
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
              <span className="mt-2 block text-sm font-medium text-slate-500">
                Higher tolerance removes colors close to the selected color.
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="inline-flex rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">
              Reset
            </button>
            <button type="button" onClick={handleRemoveColor} disabled={loading} className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Removing Color..." : "Remove Color"}
            </button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
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
