"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { removeImageExif } from "@/lib/image/exif-remover";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function ExifRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [cleanedImage, setCleanedImage] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("cleaned-image.png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCleanedImage("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-exif-removed.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setCleanedImage("");
    setDownloadFileName("cleaned-image.png");
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleRemoveExif() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const result = await removeImageExif(file);
      setCleanedImage(result);
      setDownloadFileName(`${getBaseName(file.name)}-exif-removed.png`);
    } catch {
      setError("Something went wrong while removing metadata from the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="EXIF Remover"
      description="Upload an image and create a clean PNG by redrawing it without embedded metadata."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
            <button type="button" onClick={handleRemoveExif} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Cleaning..." : "Remove EXIF"}</button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Cleaned Image" downloadHref={cleanedImage} downloadName={downloadFileName} downloadLabel="Download Cleaned PNG">
        {cleanedImage && <img src={cleanedImage} alt="Cleaned preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
