"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { extractTextFromImage } from "@/lib/image/ocr";
import { revokeObjectUrl } from "@/lib/object-url";

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const textDownloadUrl = useMemo(() => {
    if (!extractedText) return "";

    const blob = new Blob([extractedText], { type: "text/plain" });
    return URL.createObjectURL(blob);
  }, [extractedText]);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  useEffect(() => {
    return () => revokeObjectUrl(textDownloadUrl);
  }, [textDownloadUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setExtractedText("");
    setCopied(false);
    setProcessingStep("");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setExtractedText("");
    setCopied(false);
    setProcessingStep("");
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
      setProcessingStep("Preparing image...");
      await new Promise((resolve) => setTimeout(resolve, 80));
      setProcessingStep("Running OCR recognition...");
      const text = await extractTextFromImage(file);
      setProcessingStep("Formatting extracted text...");
      setExtractedText(text || "No text was detected in this image.");
    } catch {
      setError("Something went wrong while extracting text from the image.");
    } finally {
      setLoading(false);
      setProcessingStep("");
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
          {(loading || processingStep) && (
            <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-slate-600">
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#EEF2FF] shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
              {processingStep || "Processing image..."}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
          </div>
          <button type="button" onClick={handleExtractText} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Extracting..." : "Extract Text"}</button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Image Preview">
        {preview && <img src={preview} alt="Uploaded preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Extracted Text">
        {extractedText && (
          <div className="w-full">
            <div className="mb-4 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={handleCopyText} className="rounded-2xl bg-[#EEF2FF] px-4 py-2.5 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">{copied ? "Copied" : "Copy All"}</button>
              <a href={textDownloadUrl} download="ocr-extracted-text.txt" className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95">
                Download TXT
              </a>
            </div>
            <article className="max-h-[420px] overflow-auto rounded-3xl bg-white/80 p-5 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff]">
              <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-800">{extractedText}</pre>
            </article>
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}
