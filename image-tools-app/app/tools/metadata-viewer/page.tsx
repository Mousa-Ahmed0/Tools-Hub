"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ImageMetadata, getImageMetadata } from "@/lib/image/metadata";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export default function MetadataViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      setError("");
      setFile(selectedFile);
      setMetadata(null);
      setPreview(URL.createObjectURL(selectedFile));
      const result = await getImageMetadata(selectedFile);
      setMetadata(result);
    } catch {
      setError("Could not read metadata from this image.");
    }
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setMetadata(null);
    setError("");
    setInputKey((current) => current + 1);
  }

  return (
    <ToolPageShell
      title="Image Metadata Viewer"
      description="Upload an image to view its file details, dimensions, and type."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
          <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Image Preview">
        {preview && <img src={preview} alt="Uploaded preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Metadata">
        {metadata && (
          <dl className="w-full space-y-3 rounded-2xl bg-white/70 p-4 text-sm">
            {[
              ["File name", metadata.fileName],
              ["File size", formatFileSize(metadata.fileSize)],
              ["Dimensions", `${metadata.width} x ${metadata.height}px`],
              ["Image type", metadata.imageType],
              ["Last modified", formatDate(metadata.lastModified)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-bold text-slate-900">{label}</dt>
                <dd className="mt-1 break-words text-slate-600">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}
