"use client";

import { ChangeEvent, useEffect, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { imagesToPdf } from "@/lib/pdf/image-to-pdf";
import { revokeObjectUrl, revokeObjectUrls } from "@/lib/object-url";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("images-to-pdf.pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrls(previews.map((preview) => preview.url));
  }, [previews]);

  useEffect(() => {
    return () => revokeObjectUrl(pdfUrl);
  }, [pdfUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;
    setFiles(selectedFiles);
    setPreviews(
      selectedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
    setPdfUrl("");
    setDownloadFileName(
      selectedFiles.length === 1
        ? `${selectedFiles[0].name.replace(/\.[^/.]+$/, "")}-image.pdf`
        : `${selectedFiles[0].name.replace(/\.[^/.]+$/, "")}-images.pdf`
    );
    setError("");
  }

  function handleReset() {
    setFiles([]);
    setPreviews([]);
    setPdfUrl("");
    setDownloadFileName("images-to-pdf.pdf");
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleConvert() {
    if (!files.length) {
      setError("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const pdfBlob = await imagesToPdf(files);
      setPdfUrl(URL.createObjectURL(pdfBlob));
    } catch {
      setError("Something went wrong while creating the PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Image to PDF"
      description="Upload one or more images and convert them into a single PDF file."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox inputKey={inputKey} label="Upload Images" accept="image/*" multiple files={files} onChange={handleFileChange} />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">
              Reset
            </button>
          </div>
          <button type="button" onClick={handleConvert} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating PDF..." : "Convert to PDF"}
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Selected Images" emptyText="Selected image previews will appear here.">
        {previews.length > 0 && (
          <div className="grid w-full gap-4 sm:grid-cols-2">
            {previews.map((preview) => (
              <div key={preview.url} className="rounded-2xl bg-white/70 p-3">
                <img src={preview.url} alt={preview.name} className="mx-auto max-h-44 w-auto max-w-full rounded-xl object-contain" />
                <p className="mt-2 truncate text-xs font-semibold text-slate-600">{preview.name}</p>
              </div>
            ))}
          </div>
        )}
      </PreviewPanel>
      <ResultPanel title="PDF Result" downloadHref={pdfUrl} downloadName={downloadFileName} downloadLabel="Download PDF">
        {pdfUrl && <p className="text-center text-sm font-semibold text-emerald-700">Your PDF file has been created successfully.</p>}
      </ResultPanel>
    </ToolPageShell>
  );
}
