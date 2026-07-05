"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { compressImage } from "@/lib/image/compress";
import { revokeObjectUrl } from "@/lib/object-url";

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
  const [downloadFileName, setDownloadFileName] = useState("compressed-image.jpg");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCompressedImage("");
    setCompressedSize(null);
    setDimensions(null);
    setError("");
    setQuality("0.7");
    setDownloadFileName(`${selectedFile.name.replace(/\.[^/.]+$/, "")}-compressed.jpg`);

    getImageDimensions(selectedFile)
      .then((result) => setDimensions(result))
      .catch(() => setDimensions(null));
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setCompressedImage("");
    setCompressedSize(null);
    setDimensions(null);
    setQuality("0.7");
    setLoading(false);
    setError("");
    setDownloadFileName("compressed-image.jpg");
    setInputKey((current) => current + 1);
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
      setDownloadFileName(`${file.name.replace(/\.[^/.]+$/, "")}-compressed.jpg`);
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
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
              <LocalizedText>Quality</LocalizedText> ({qualityPercent}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => {
                setQuality(e.target.value);
                setCompressedImage("");
                setCompressedSize(null);
              }}
              className="w-full accent-indigo-600"
            />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              <LocalizedText>Lower quality usually means smaller file size.</LocalizedText>
            </p>
          </div>

          {file && (
            <div className="rounded-2xl bg-white/70 dark:bg-slate-950/70 p-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-slate-100"><LocalizedText>File Info</LocalizedText></p>
              <div className="mt-3 space-y-2">
                <p><LocalizedText>Name</LocalizedText>: <span className="font-semibold text-slate-900 dark:text-slate-100">{file.name}</span></p>
                <p><LocalizedText>Type</LocalizedText>: <span className="font-semibold text-slate-900 dark:text-slate-100">{file.type || <LocalizedText>Unknown</LocalizedText>}</span></p>
                {dimensions && <p><LocalizedText>Dimensions</LocalizedText>: <span className="font-semibold text-slate-900 dark:text-slate-100">{dimensions.width} x {dimensions.height}</span></p>}
                <p><LocalizedText>Original size</LocalizedText>: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatFileSize(file.size)}</span></p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600">
              <LocalizedText>Reset</LocalizedText>
            </button>
          </div>

          <button type="button" onClick={handleCompress} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            <LocalizedText>{loading ? "Compressing..." : "Compress Image"}</LocalizedText>
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>

      <ResultPanel title="Compressed Image" downloadHref={compressedImage} downloadName={downloadFileName} downloadLabel="Download Compressed Image">
        {compressedImage && (
          <div className="w-full">
            <img src={compressedImage} alt="Compressed preview" className="mx-auto max-h-[420px] w-auto max-w-full rounded-2xl object-contain" />
            {compressedSize && (
              <div className="mt-4 rounded-2xl bg-white/70 dark:bg-slate-950/70 p-4 text-sm text-slate-600 dark:text-slate-400">
                <p><LocalizedText>Size</LocalizedText>: <span className="font-bold text-slate-900 dark:text-slate-100">{formatFileSize(compressedSize)}</span></p>
                {savedPercentage && <p><LocalizedText>Reduced by</LocalizedText>: <span className={`font-bold ${isReduced ? "text-emerald-700" : "text-amber-700"}`}>{savedPercentage}%</span></p>}
                <p><LocalizedText>Status</LocalizedText>: <span className={`font-bold ${isReduced ? "text-emerald-700" : "text-amber-700"}`}><LocalizedText>{isReduced ? "Compression successful" : "File generated, but not smaller"}</LocalizedText></span></p>
              </div>
            )}
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}

