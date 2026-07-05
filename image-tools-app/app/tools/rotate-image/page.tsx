"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { rotateImage } from "@/lib/image/rotate";

const presetAngles = [90, 180, 270];

export default function RotateImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [rotatedImage, setRotatedImage] = useState<string>("");
  const [degrees, setDegrees] = useState<string>("90");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("rotated-image.png");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setRotatedImage("");
    setError("");
    setDegrees("90");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-rotated.png`);
  }

  function handleReset() {
    setDegrees("90");
    setRotatedImage("");
    setError("");
  }

  async function handleRotate() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedDegrees = Number(degrees);

    if (Number.isNaN(parsedDegrees)) {
      setError("Please enter a valid rotation angle.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await rotateImage(file, parsedDegrees);
      const normalizedDegrees = ((parsedDegrees % 360) + 360) % 360;
      const originalName = file.name.replace(/\.[^/.]+$/, "");

      setDownloadFileName(`${originalName}-rotated-${normalizedDegrees}.png`);
      setRotatedImage(result);
    } catch {
      setError("Something went wrong while rotating the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Rotate Image"
      description="Upload an image, choose a preset angle or type your own angle, then download the rotated result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-900">
              Quick Angles
            </label>
            <div className="flex flex-wrap gap-3">
              {presetAngles.map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setDegrees(String(angle))}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                    degrees === String(angle)
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff]"
                      : "bg-[#EEF2FF] text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] hover:text-indigo-600"
                  }`}
                >
                  {angle} deg
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">
              Custom Angle
            </span>
            <input
              type="number"
              value={degrees}
              onChange={(e) => setDegrees(e.target.value)}
              placeholder="Enter angle, e.g. 45"
              className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">
              Reset
            </button>
            <button type="button" onClick={handleRotate} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Rotating..." : "Rotate Image"}
            </button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Rotated Image" downloadHref={rotatedImage} downloadName={downloadFileName} downloadLabel="Download Rotated Image">
        {rotatedImage && <img src={rotatedImage} alt="Rotated preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
