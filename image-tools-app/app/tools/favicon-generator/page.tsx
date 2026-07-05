"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { GeneratedFaviconImage, generateFavicons } from "@/lib/image/favicon";
import { revokeObjectUrl } from "@/lib/object-url";

export default function FaviconGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [faviconImages, setFaviconImages] = useState<GeneratedFaviconImage[]>([]);
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const icoUrl = useMemo(() => {
    if (!icoBlob) return "";
    return URL.createObjectURL(icoBlob);
  }, [icoBlob]);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  useEffect(() => {
    return () => revokeObjectUrl(icoUrl);
  }, [icoUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setFaviconImages([]);
    setIcoBlob(null);
    setError("");

    handleGenerate(selectedFile);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setFaviconImages([]);
    setIcoBlob(null);
    setError("");
    setInputKey((current) => current + 1);
  }

  function handleRetryGenerate() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setFaviconImages([]);
    setIcoBlob(null);
    handleGenerate(file);
  }

  async function handleGenerate(selectedFile: File) {
    try {
      setLoading(true);
      setError("");

      const result = await generateFavicons(selectedFile);

      setFaviconImages(result.images);
      setIcoBlob(result.icoBlob);
    } catch {
      setError("Something went wrong while generating the favicon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Favicon Generator"
      description="Upload an image and generate favicon PNG previews plus a favicon.ico file."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            key={inputKey}
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          {loading && (
            <div className="rounded-2xl bg-white/70 dark:bg-slate-950/70 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400">
              <LocalizedText>Generating favicon files...</LocalizedText>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex w-fit rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600"
          >
            <LocalizedText>Reset</LocalizedText>
          </button>

          {file && (
            <button
              type="button"
              onClick={handleRetryGenerate}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LocalizedText>{loading ? "Generating..." : faviconImages.length ? "Regenerate Favicons" : "Generate Favicons"}</LocalizedText>
            </button>
          )}
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>

      <ResultPanel
        title="Favicon Preview"
        downloadHref={icoUrl}
        downloadName="favicon.ico"
        downloadLabel="Download favicon.ico"
        emptyText="Generated favicon previews will appear here."
      >
        {faviconImages.length > 0 && (
          <div className="grid w-full gap-3 sm:grid-cols-3">
            {faviconImages.map((image) => (
              <div key={image.size} className="rounded-2xl bg-white/70 dark:bg-slate-950/70 p-4 text-center">
                <div className="flex h-20 items-center justify-center rounded-xl bg-[#EEF2FF] dark:bg-slate-900 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
                  <img
                    src={image.dataUrl}
                    alt={`${image.size} by ${image.size} favicon`}
                    width={image.size}
                    height={image.size}
                    className="rounded"
                  />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {image.size} x {image.size}
                </p>
              </div>
            ))}
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}

