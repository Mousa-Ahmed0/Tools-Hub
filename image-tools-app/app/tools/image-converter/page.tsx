"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { convertImage } from "@/lib/image/convert";
import { revokeObjectUrl } from "@/lib/object-url";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [convertedImage, setConvertedImage] = useState<string>("");
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setConvertedImage("");
    setError("");
    setFormat("png");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setConvertedImage("");
    setFormat("png");
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleConvert() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await convertImage(file, format);
      setConvertedImage(result);
    } catch {
      setError("Something went wrong while converting the image.");
    } finally {
      setLoading(false);
    }
  }

  const downloadName = file
    ? `${file.name.replace(/\.[^/.]+$/, "")}-converted.${format === "jpeg" ? "jpg" : format}`
    : `converted-image.${format === "jpeg" ? "jpg" : format}`;

  return (
    <ToolPageShell
      title="Image Converter"
      description="Convert image files to PNG, JPG, or WEBP directly in your browser."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
              <LocalizedText>Output Format</LocalizedText>
            </span>
            <select
              value={format}
              onChange={(e) => {
                setFormat(e.target.value as "png" | "jpeg" | "webp");
                setConvertedImage("");
              }}
              className="w-full rounded-2xl border-0 bg-[#EEF2FF] dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WEBP</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600">
              <LocalizedText>Reset</LocalizedText>
            </button>
          </div>

          <button type="button" onClick={handleConvert} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            <LocalizedText>{loading ? "Converting..." : "Convert Image"}</LocalizedText>
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Converted Image" downloadHref={convertedImage} downloadName={downloadName} downloadLabel="Download Converted Image">
        {convertedImage && <img src={convertedImage} alt="Converted preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}

