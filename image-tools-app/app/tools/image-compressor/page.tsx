"use client";

import { ChangeEvent, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { compressImage } from "@/lib/image/compress";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function getDataUrlSize(dataUrl: string): Promise<number> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob.size;
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      reject(new Error("Could not read image dimensions."));
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [compressedImage, setCompressedImage] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [quality, setQuality] = useState<string>("0.7");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCompressedImage("");
    setCompressedSize(null);
    setDimensions(null);
    setError("");

    getImageDimensions(selectedFile)
      .then((result) => setDimensions(result))
      .catch(() => setDimensions(null));
  }

  async function handleCompress() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedQuality = Number(quality);

    if (!parsedQuality || parsedQuality <= 0 || parsedQuality > 1) {
      setError("Please enter a quality value between 0.1 and 1.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await compressImage(file, parsedQuality);
      const resultSize = await getDataUrlSize(result);

      setCompressedImage(result);
      setCompressedSize(resultSize);
    } catch {
      setError("Something went wrong while compressing the image.");
    } finally {
      setLoading(false);
    }
  }

  const qualityPercent = useMemo(() => Math.round(Number(quality) * 100), [quality]);
  const originalSize = file ? file.size : null;
  const savedPercentage =
    originalSize && compressedSize
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : null;
  const isReduced = originalSize && compressedSize ? compressedSize < originalSize : false;

  return (
    <ToolPageShell
      title="Image Compressor"
      description="Reduce image file size by lowering image quality directly in your browser."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900">
              Quality ({qualityPercent}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full accent-indigo-600"
            />
            <p className="mt-2 text-sm text-slate-500">
              Lower quality usually means smaller file size.
            </p>
          </div>

          {file && (
            <div className="rounded-2xl bg-white/70 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-900">File Info</p>
              <div className="mt-3 space-y-2">
                <p>Name: <span className="font-semibold text-slate-900">{file.name}</span></p>
                <p>Type: <span className="font-semibold text-slate-900">{file.type || "Unknown"}</span></p>
                {dimensions && <p>Dimensions: <span className="font-semibold text-slate-900">{dimensions.width} x {dimensions.height}</span></p>}
                <p>Original size: <span className="font-semibold text-slate-900">{formatFileSize(file.size)}</span></p>
              </div>
            </div>
          )}

          <button type="button" onClick={handleCompress} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Compressing..." : "Compress Image"}
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>

      <ResultPanel title="Compressed Image" downloadHref={compressedImage} downloadName="compressed-image.jpg" downloadLabel="Download Compressed Image">
        {compressedImage && (
          <div className="w-full">
            <img src={compressedImage} alt="Compressed preview" className="mx-auto max-h-[420px] w-auto max-w-full rounded-2xl object-contain" />
            {compressedSize && (
              <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-slate-600">
                <p>Size: <span className="font-bold text-slate-900">{formatFileSize(compressedSize)}</span></p>
                {savedPercentage && <p>Reduced by: <span className={`font-bold ${isReduced ? "text-emerald-700" : "text-amber-700"}`}>{savedPercentage}%</span></p>}
                <p>Status: <span className={`font-bold ${isReduced ? "text-emerald-700" : "text-amber-700"}`}>{isReduced ? "Compression successful" : "File generated, but not smaller"}</span></p>
              </div>
            )}
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}
