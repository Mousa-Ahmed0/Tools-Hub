import JSZip from "jszip";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export type PdfImageFormat = "png" | "jpeg";

function getMimeType(format: PdfImageFormat): string {
  return format === "png" ? "image/png" : "image/jpeg";
}

function getExtension(format: PdfImageFormat): string {
  return format === "png" ? "png" : "jpg";
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);

  if (!mimeMatch) {
    throw new Error("Invalid data URL.");
  }

  const mime = mimeMatch[1];
  const binary = atob(data);
  const length = binary.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
}

async function loadPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return getDocument({ data: arrayBuffer }).promise;
}

async function renderPdfPageToCanvas(
  file: File,
  pageNumber: number,
  scale = 2
): Promise<HTMLCanvasElement> {
  const pdf = await loadPdf(file);

  if (pageNumber < 1 || pageNumber > pdf.numPages) {
    throw new Error("Invalid page number.");
  }

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context.");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context as CanvasRenderingContext2D,
    viewport,
  }).promise;

  return canvas;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const pdf = await loadPdf(file);
  return pdf.numPages;
}

export async function pdfPageToImage(
  file: File,
  pageNumber: number,
  format: PdfImageFormat = "png"
): Promise<string> {
  const canvas = await renderPdfPageToCanvas(file, pageNumber, 2);

  if (format === "png") {
    return canvas.toDataURL(getMimeType(format));
  }

  return canvas.toDataURL(getMimeType(format), 0.92);
}

export async function pdfAllPagesToZip(
  file: File,
  format: PdfImageFormat = "png"
): Promise<Blob> {
  const pdf = await loadPdf(file);
  const zip = new JSZip();
  const extension = getExtension(format);

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const canvas = await renderPdfPageToCanvas(file, pageNumber, 2);

    const dataUrl =
      format === "png"
        ? canvas.toDataURL(getMimeType(format))
        : canvas.toDataURL(getMimeType(format), 0.92);

    const blob = dataUrlToBlob(dataUrl);
    zip.file(`page-${pageNumber}.${extension}`, blob);
  }

  return zip.generateAsync({ type: "blob" });
}