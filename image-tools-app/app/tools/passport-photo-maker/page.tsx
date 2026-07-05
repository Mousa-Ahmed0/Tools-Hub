"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { revokeObjectUrl } from "@/lib/object-url";
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
  const [downloadFileName, setDownloadFileName] = useState("passport-photo.png");
  const [inputKey, setInputKey] = useState(0);

  const selectedPreset =
    passportPhotoPresets.find((preset) => preset.key === selectedPresetKey) ??
    passportPhotoPresets[0];

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

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
    <ToolPageShell
      title="Passport Photo Maker"
      description="Upload an image, choose a photo size, and create a white-background PNG."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            key={inputKey}
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Photo Size</LocalizedText></label>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {passportPhotoPresets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey(preset.key);
                    setPassportPhoto("");
                  }}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                    selectedPresetKey === preset.key
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
                      : "bg-[#EEF2FF] dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] hover:text-indigo-600"
                  }`}
                >
                  <span className="block"><LocalizedText>{preset.label}</LocalizedText></span>
                  <span className="mt-1 block text-xs opacity-80"><LocalizedText>{preset.description}</LocalizedText></span>
                  <span className="mt-1 block text-xs opacity-80">
                    {preset.width} x {preset.height}px
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="inline-flex rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600">
              <LocalizedText>Reset</LocalizedText>
            </button>
          </div>
          <button type="button" onClick={handleGenerate} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            <LocalizedText>{loading ? "Generating..." : "Generate Photo"}</LocalizedText>
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>

      <ResultPanel
        title="Generated Photo"
        downloadHref={passportPhoto}
        downloadName={downloadFileName}
        downloadLabel="Download PNG"
        emptyText="Your generated passport photo will appear here."
      >
        {passportPhoto && <img src={passportPhoto} alt="Generated passport photo" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}

