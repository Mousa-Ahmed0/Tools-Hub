"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { resizeForCanvasFit } from "@/lib/image/resize-for-social";

type InstagramPreset = { key: string; label: string; width: number; height: number };

const presets: InstagramPreset[] = [
  { key: "square", label: "Instagram Square", width: 1080, height: 1080 },
  { key: "portrait", label: "Instagram Portrait", width: 1080, height: 1350 },
  { key: "landscape", label: "Instagram Landscape", width: 1080, height: 566 },
  { key: "story", label: "Instagram Story", width: 1080, height: 1920 },
];

export default function ResizeForInstagramPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resizedImage, setResizedImage] = useState<string>("");
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("square");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("instagram-image.png");

  const selectedPreset = presets.find((preset) => preset.key === selectedPresetKey) ?? presets[0];

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResizedImage("");
    setError("");
    setDownloadFileName(`${selectedFile.name.replace(/\.[^/.]+$/, "")}-${selectedPreset.key}.png`);
  }

  function handleReset() {
    setSelectedPresetKey("square");
    setResizedImage("");
    setError("");
    if (file) setDownloadFileName(`${file.name.replace(/\.[^/.]+$/, "")}-square.png`);
  }

  async function handleResize() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const result = await resizeForCanvasFit(file, selectedPreset.width, selectedPreset.height);
      setDownloadFileName(`${file.name.replace(/\.[^/.]+$/, "")}-${selectedPreset.width}x${selectedPreset.height}.png`);
      setResizedImage(result);
    } catch {
      setError("Something went wrong while resizing the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Resize for Instagram"
      description="Upload an image, choose an Instagram format, and download the resized result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
          <div>
            <label className="mb-3 block text-sm font-bold text-slate-900">Instagram Preset</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {presets.map((preset) => (
                <button key={preset.key} type="button" onClick={() => setSelectedPresetKey(preset.key)} className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${selectedPresetKey === preset.key ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff]" : "bg-[#EEF2FF] text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] hover:text-indigo-600"}`}>
                  <div>{preset.label}</div>
                  <div className="mt-1 text-xs opacity-80">{preset.width} x {preset.height}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
            <button type="button" onClick={handleResize} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Resizing..." : "Resize for Instagram"}</button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Resized Image" downloadHref={resizedImage} downloadName={downloadFileName} downloadLabel="Download Image">
        {resizedImage && <img src={resizedImage} alt="Instagram resized preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
