"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { extractTextFromImage } from "@/lib/image/ocr";

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setExtractedText("");
    setCopied(false);
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setExtractedText("");
    setCopied(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleExtractText() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setCopied(false);
      const text = await extractTextFromImage(file);
      setExtractedText(text || "No text was detected in this image.");
    } catch {
      setError("Something went wrong while extracting text from the image.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyText() {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setError("");
    } catch {
      setError("Could not copy the extracted text.");
    }
  }

  return (
    <ToolPageShell
      title="OCR Image to Text"
      description="Upload an image and extract readable text directly in your browser."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
            <button type="button" onClick={handleExtractText} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Extracting..." : "Extract Text"}</button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Image Preview">
        {preview && <img src={preview} alt="Uploaded preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Extracted Text">
        {extractedText && (
          <div className="w-full">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={handleCopyText} className="rounded-2xl bg-[#EEF2FF] px-4 py-2.5 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">{copied ? "Copied" : "Copy Text"}</button>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-white/70 p-4 text-sm leading-6 text-slate-800">{extractedText}</pre>
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}
