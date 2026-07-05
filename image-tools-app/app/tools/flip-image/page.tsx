"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { flipImage } from "@/lib/image/flip";

type FlipDirection = "horizontal" | "vertical";

export default function FlipImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [flippedImage, setFlippedImage] = useState<string>("");
  const [direction, setDirection] = useState<FlipDirection>("horizontal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("flipped-image.png");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setFlippedImage("");
    setError("");
    setDirection("horizontal");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-flipped.png`);
  }

  function handleReset() {
    setDirection("horizontal");
    setFlippedImage("");
    setError("");
  }

  async function handleFlip() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await flipImage(file, direction);
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(`${originalName}-flipped-${direction}.png`);
      setFlippedImage(result);
    } catch {
      setError("Something went wrong while flipping the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Flip Image"
      description="Upload an image, choose a flip direction, and download the result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-900">
              Flip Direction
            </label>
            <div className="flex flex-wrap gap-3">
              {(["horizontal", "vertical"] as FlipDirection[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDirection(option)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-bold capitalize transition ${
                    direction === option
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff]"
                      : "bg-[#EEF2FF] text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] hover:text-indigo-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">
              Reset
            </button>
            <button type="button" onClick={handleFlip} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Flipping..." : "Flip Image"}
            </button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Flipped Image" downloadHref={flippedImage} downloadName={downloadFileName} downloadLabel="Download Flipped Image">
        {flippedImage && <img src={flippedImage} alt="Flipped preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
