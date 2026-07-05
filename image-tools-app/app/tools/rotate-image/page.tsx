"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { useI18n } from "@/lib/i18n";
import { rotateImage } from "@/lib/image/rotate";
import { revokeObjectUrl } from "@/lib/object-url";

const presetAngles = [90, 180, 270];

export default function RotateImagePage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [rotatedImage, setRotatedImage] = useState<string>("");
  const [degrees, setDegrees] = useState<string>("90");
  const [currentRotation, setCurrentRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("rotated-image.png");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setRotatedImage("");
    setError("");
    setDegrees("90");
    setCurrentRotation(0);

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-rotated.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setDegrees("90");
    setCurrentRotation(0);
    setRotatedImage("");
    setLoading(false);
    setError("");
    setDownloadFileName("rotated-image.png");
    setInputKey((current) => current + 1);
  }

  function handleDegreesChange(value: string) {
    setDegrees(value);
    setRotatedImage("");
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

      const nextRotation = ((currentRotation + parsedDegrees) % 360 + 360) % 360;
      const result = await rotateImage(file, nextRotation);
      const originalName = file.name.replace(/\.[^/.]+$/, "");

      setCurrentRotation(nextRotation);
      setDownloadFileName(`${originalName}-rotated-${nextRotation}.png`);
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
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-slate-100">
              <LocalizedText>Quick Angles</LocalizedText>
            </label>
            <div className="flex flex-wrap gap-3">
              {presetAngles.map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => handleDegreesChange(String(angle))}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                    degrees === String(angle)
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
                      : "bg-[#EEF2FF] dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] hover:text-indigo-600"
                  }`}
                >
                  {angle} <LocalizedText>deg</LocalizedText>
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
              <LocalizedText>Custom Angle</LocalizedText>
            </span>
            <input
              type="number"
              value={degrees}
              onChange={(e) => handleDegreesChange(e.target.value)}
              placeholder={t("toolUi.enterAngle")}
              className="w-full rounded-2xl border-0 bg-[#EEF2FF] dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
            />
          </label>

          <div className="rounded-2xl bg-white/70 dark:bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <LocalizedText>Current rotation</LocalizedText>: {currentRotation} <LocalizedText>deg</LocalizedText>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600">
              <LocalizedText>Reset</LocalizedText>
            </button>
          </div>
          <button type="button" onClick={handleRotate} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            <LocalizedText>{loading ? "Rotating..." : "Rotate Image"}</LocalizedText>
          </button>
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

