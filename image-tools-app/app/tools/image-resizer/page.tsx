"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { resizeImage } from "@/lib/image/resize";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [resizedImage, setResizedImage] = useState<string>("");
  const [width, setWidth] = useState<string>("800");
  const [height, setHeight] = useState<string>("600");
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("resized-image.png");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();

    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(String(img.width));
      setHeight(String(img.height));
    };

    img.src = objectUrl;

    setFile(selectedFile);
    setPreview(objectUrl);
    setResizedImage("");
    setError("");

    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDownloadFileName(`${originalName}-resized.png`);
  }

  function handleWidthChange(value: string) {
    setWidth(value);

    if (!keepAspectRatio || !originalWidth || !originalHeight) return;
    if (!value) {
      setHeight("");
      return;
    }

    const nextWidth = Number(value);
    if (!nextWidth || nextWidth <= 0) return;

    const nextHeight = Math.round((nextWidth * originalHeight) / originalWidth);
    setHeight(String(nextHeight));
  }

  function handleHeightChange(value: string) {
    setHeight(value);

    if (!keepAspectRatio || !originalWidth || !originalHeight) return;
    if (!value) {
      setWidth("");
      return;
    }

    const nextHeight = Number(value);
    if (!nextHeight || nextHeight <= 0) return;

    const nextWidth = Math.round((nextHeight * originalWidth) / originalHeight);
    setWidth(String(nextWidth));
  }

  function handleSwapDimensions() {
    setWidth(height);
    setHeight(width);
  }

  async function handleResize() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    if (!parsedWidth || !parsedHeight || parsedWidth <= 0 || parsedHeight <= 0) {
      setError("Please enter valid width and height.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await resizeImage(file, parsedWidth, parsedHeight);

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(`${originalName}-${parsedWidth}x${parsedHeight}.png`);

      setResizedImage(result);
    } catch {
      setError("Something went wrong while resizing the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Image Resizer"
      description="Upload an image, set custom dimensions, and download the resized result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          {originalWidth && originalHeight && (
            <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700">
              Original size: {originalWidth} x {originalHeight}px
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              id="keep-aspect-ratio"
              type="checkbox"
              checked={keepAspectRatio}
              onChange={(e) => setKeepAspectRatio(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label
              htmlFor="keep-aspect-ratio"
              className="text-sm font-semibold text-slate-700"
            >
              Keep aspect ratio
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">
                Width
              </span>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">
                Height
              </span>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSwapDimensions}
              className="inline-flex rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600"
            >
              Swap Dimensions
            </button>

            <button
              type="button"
              onClick={handleResize}
              disabled={loading}
              className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resizing..." : "Resize Image"}
            </button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && (
          <img
            src={preview}
            alt="Original preview"
            className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain"
          />
        )}
      </PreviewPanel>

      <ResultPanel
        title="Resized Image"
        downloadHref={resizedImage}
        downloadName={downloadFileName}
        downloadLabel="Download Resized Image"
      >
        {resizedImage && (
          <img
            src={resizedImage}
            alt="Resized preview"
            className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain"
          />
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}
