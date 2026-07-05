"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import {
  getPdfPageCount,
  pdfAllPagesToZip,
  pdfPageToImage,
  type PdfImageFormat,
} from "@/lib/pdf/pdf-to-image";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<string>("1");
  const [format, setFormat] = useState<PdfImageFormat>("png");
  const [imageUrl, setImageUrl] = useState("");
  const [zipUrl, setZipUrl] = useState("");
  const [loadingSingle, setLoadingSingle] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState("");
  const [imageDownloadFileName, setImageDownloadFileName] = useState("pdf-page.png");
  const [zipDownloadFileName, setZipDownloadFileName] = useState("pdf-pages.zip");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      setLoadingSingle(true);
      setError("");
      setImageUrl("");
      setZipUrl("");
      setFile(selectedFile);
      const pages = await getPdfPageCount(selectedFile);
      setPageCount(pages);
      setPageNumber("1");
      const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setImageDownloadFileName(`${originalName}-page-1.${format === "png" ? "png" : "jpg"}`);
      setZipDownloadFileName(`${originalName}-pages-${format}.zip`);
    } catch {
      setError("Could not read the PDF file.");
      setFile(null);
      setPageCount(0);
      setPageNumber("1");
    } finally {
      setLoadingSingle(false);
    }
  }

  function handleReset() {
    setPageNumber("1");
    setFormat("png");
    setImageUrl("");
    setZipUrl("");
    setError("");
    if (file) {
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setImageDownloadFileName(`${originalName}-page-1.png`);
      setZipDownloadFileName(`${originalName}-pages-png.zip`);
    }
  }

  async function handleConvertSingle() {
    if (!file) {
      setError("Please upload a PDF first.");
      return;
    }
    const parsedPage = Number(pageNumber);
    if (!parsedPage || parsedPage < 1 || parsedPage > pageCount) {
      setError("Please enter a valid page number.");
      return;
    }
    try {
      setLoadingSingle(true);
      setError("");
      setZipUrl("");
      const result = await pdfPageToImage(file, parsedPage, format);
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const extension = format === "png" ? "png" : "jpg";
      setImageDownloadFileName(`${originalName}-page-${parsedPage}.${extension}`);
      setImageUrl(result);
    } catch {
      setError("Something went wrong while converting the PDF page.");
    } finally {
      setLoadingSingle(false);
    }
  }

  async function handleConvertAll() {
    if (!file) {
      setError("Please upload a PDF first.");
      return;
    }
    try {
      setLoadingAll(true);
      setError("");
      const zipBlob = await pdfAllPagesToZip(file, format);
      const objectUrl = URL.createObjectURL(zipBlob);
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setZipDownloadFileName(`${originalName}-pages-${format}.zip`);
      setZipUrl(objectUrl);
    } catch {
      setError("Something went wrong while converting all PDF pages.");
    } finally {
      setLoadingAll(false);
    }
  }

  return (
    <ToolPageShell
      title="PDF to Image"
      description="Upload a PDF, choose a page and output format, then convert one page or all pages into images."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox label="Upload PDF" accept="application/pdf" file={file} onChange={handleFileChange} />
          {pageCount > 0 && <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700">Total pages: {pageCount}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Page Number</span>
              <input type="number" min={1} max={pageCount || 1} value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Output Format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value as PdfImageFormat)} className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]">
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
            <button type="button" onClick={handleConvertSingle} disabled={loadingSingle} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loadingSingle ? "Converting Page..." : "Convert Current Page"}</button>
            <button type="button" onClick={handleConvertAll} disabled={loadingAll} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">{loadingAll ? "Converting All..." : "Convert All Pages"}</button>
          </div>
        </ToolControlsPanel>
      }
    >
      <ResultPanel title="Converted Image" downloadHref={imageUrl} downloadName={imageDownloadFileName} downloadLabel="Download Image">
        {imageUrl && <img src={imageUrl} alt="Converted PDF page preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
      <ResultPanel title="All Pages ZIP" downloadHref={zipUrl} downloadName={zipDownloadFileName} downloadLabel="Download ZIP">
        {zipUrl && <p className="text-center text-sm font-semibold text-emerald-700">All PDF pages were converted and packed into a ZIP file.</p>}
      </ResultPanel>
    </ToolPageShell>
  );
}
