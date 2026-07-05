"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { flipImage } from "@/lib/image/flip";
import { rotateImage } from "@/lib/image/rotate";
import { revokeObjectUrl } from "@/lib/object-url";

type FlipDirection = "horizontal" | "vertical";

export default function FlipImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [flippedImage, setFlippedImage] = useState<string>("");
  const [direction, setDirection] = useState<FlipDirection>("horizontal");
  const [flippedHorizontal, setFlippedHorizontal] = useState(false);
  const [flippedVertical, setFlippedVertical] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("flipped-image.png");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setFlippedImage("");
    setError("");
    setDirection("horizontal");
    setFlippedHorizontal(false);
    setFlippedVertical(false);

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-flipped.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setDirection("horizontal");
    setFlippedHorizontal(false);
    setFlippedVertical(false);
    setFlippedImage("");
    setLoading(false);
    setError("");
    setDownloadFileName("flipped-image.png");
    setInputKey((current) => current + 1);
  }

  function handleDirectionChange(nextDirection: FlipDirection) {
    setDirection(nextDirection);
    setFlippedImage("");
  }

  async function handleFlip() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const nextHorizontal =
        direction === "horizontal" ? !flippedHorizontal : flippedHorizontal;
      const nextVertical =
        direction === "vertical" ? !flippedVertical : flippedVertical;
      let result: string;

      if (nextHorizontal && nextVertical) {
        result = await rotateImage(file, 180);
      } else if (nextHorizontal) {
        result = await flipImage(file, "horizontal");
      } else if (nextVertical) {
        result = await flipImage(file, "vertical");
      } else {
        result = preview;
      }

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const stateLabel =
        nextHorizontal && nextVertical
          ? "horizontal-vertical"
          : nextHorizontal
          ? "horizontal"
          : nextVertical
          ? "vertical"
          : "original";
      setFlippedHorizontal(nextHorizontal);
      setFlippedVertical(nextVertical);
      setDownloadFileName(`${originalName}-flipped-${stateLabel}.png`);
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
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-900">
              Flip Direction
            </label>
            <div className="flex flex-wrap gap-3">
              {(["horizontal", "vertical"] as FlipDirection[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleDirectionChange(option)}
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
          </div>
          <button type="button" onClick={handleFlip} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Flipping..." : "Flip Image"}
          </button>
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
