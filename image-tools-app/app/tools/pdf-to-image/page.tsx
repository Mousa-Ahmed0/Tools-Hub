"use client";

import { ChangeEvent, useState } from "react";
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
  const [imageDownloadFileName, setImageDownloadFileName] =
    useState("pdf-page.png");
  const [zipDownloadFileName, setZipDownloadFileName] =
    useState("pdf-pages.zip");

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
      setImageDownloadFileName(
        `${originalName}-page-1.${format === "png" ? "png" : "jpg"}`
      );
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

      setImageDownloadFileName(
        `${originalName}-page-${parsedPage}.${extension}`
      );
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
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            PDF to Image
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload a PDF, choose a page and output format, then convert one page
            or all pages into images.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Upload PDF
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />

            {pageCount > 0 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                Total pages: <span className="font-semibold">{pageCount}</span>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Page Number
                </label>
                <input
                  type="number"
                  min={1}
                  max={pageCount || 1}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Output Format
                </label>

                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as PdfImageFormat)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPG</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                onClick={handleConvertSingle}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loadingSingle ? "Converting Page..." : "Convert Current Page"}
              </button>

              <button
                onClick={handleConvertAll}
                className="inline-flex rounded-xl border border-black px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
              >
                {loadingAll ? "Converting All Pages..." : "Convert All Pages"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {imageUrl && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Converted Image
              </h2>

              <img
                src={imageUrl}
                alt="Converted PDF page preview"
                className="w-full rounded-xl border border-gray-200"
              />

              <div className="mt-4">
                <a
                  href={imageUrl}
                  download={imageDownloadFileName}
                  className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  Download Image
                </a>
              </div>
            </div>
          )}

          {zipUrl && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                All Pages Ready
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                All PDF pages were converted successfully and packed into a ZIP
                file.
              </p>

              <div className="mt-4">
                <a
                  href={zipUrl}
                  download={zipDownloadFileName}
                  className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  Download ZIP
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}