"use client";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { cropImage } from "@/lib/image/crop";
import { revokeObjectUrl } from "@/lib/object-url";

export default function CropImagePage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [x, setX] = useState<string>("0");
  const [y, setY] = useState<string>("0");
  const [cropWidth, setCropWidth] = useState<string>("200");
  const [cropHeight, setCropHeight] = useState<string>("200");
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("cropped-image.png");
  const [inputKey, setInputKey] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setX("0");
      setY("0");
      setCropWidth(String(Math.min(200, img.width)));
      setCropHeight(String(Math.min(200, img.height)));
    };
    img.src = objectUrl;

    setFile(selectedFile);
    setPreview(objectUrl);
    setCroppedImage("");
    setError("");
    setDownloadFileName(`${selectedFile.name.replace(/\.[^/.]+$/, "")}-cropped.png`);
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setOriginalWidth(null);
    setOriginalHeight(null);
    setX("0");
    setY("0");
    setCropWidth("200");
    setCropHeight("200");
    setCroppedImage("");
    setLoading(false);
    setError("");
    setDownloadFileName("cropped-image.png");
    setInputKey((current) => current + 1);
  }

  function updateCropValue(setter: (next: string) => void, value: string) {
    setter(value);
    setCroppedImage("");
  }

  function getImagePoint(event: MouseEvent<HTMLImageElement>) {
    const image = imageRef.current;
    if (!image) return null;

    const rect = image.getBoundingClientRect();
    const scaleX = image.naturalWidth / rect.width;
    const scaleY = image.naturalHeight / rect.height;

    return {
      x: Math.min(image.naturalWidth, Math.max(0, Math.round((event.clientX - rect.left) * scaleX))),
      y: Math.min(image.naturalHeight, Math.max(0, Math.round((event.clientY - rect.top) * scaleY))),
    };
  }

  function updateDragSelection(point: { x: number; y: number }) {
    const start = dragStartRef.current;
    if (!start) return;

    const nextX = Math.min(start.x, point.x);
    const nextY = Math.min(start.y, point.y);
    const nextWidth = Math.max(1, Math.abs(point.x - start.x));
    const nextHeight = Math.max(1, Math.abs(point.y - start.y));

    setX(String(nextX));
    setY(String(nextY));
    setCropWidth(String(nextWidth));
    setCropHeight(String(nextHeight));
    setCroppedImage("");
  }

  function handleSelectionStart(event: MouseEvent<HTMLImageElement>) {
    const point = getImagePoint(event);
    if (!point) return;

    dragStartRef.current = point;
    setIsSelecting(true);
    setX(String(point.x));
    setY(String(point.y));
    setCropWidth("1");
    setCropHeight("1");
    setCroppedImage("");
  }

  function handleSelectionMove(event: MouseEvent<HTMLImageElement>) {
    if (!isSelecting) return;
    const point = getImagePoint(event);
    if (point) updateDragSelection(point);
  }

  function handleSelectionEnd() {
    setIsSelecting(false);
    dragStartRef.current = null;
  }

  async function handleCrop() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedX = Number(x);
    const parsedY = Number(y);
    const parsedCropWidth = Number(cropWidth);
    const parsedCropHeight = Number(cropHeight);

    if (parsedX < 0 || parsedY < 0 || !parsedCropWidth || !parsedCropHeight || parsedCropWidth <= 0 || parsedCropHeight <= 0) {
      setError("Please enter valid crop values.");
      return;
    }

    if (originalWidth && originalHeight && (parsedX + parsedCropWidth > originalWidth || parsedY + parsedCropHeight > originalHeight)) {
      setError("Crop area exceeds image boundaries.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await cropImage(file, parsedX, parsedY, parsedCropWidth, parsedCropHeight);
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFileName(`${originalName}-crop-${parsedCropWidth}x${parsedCropHeight}.png`);
      setCroppedImage(result);
    } catch {
      setError("Something went wrong while cropping the image.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-2xl border-0 bg-[#EEF2FF] dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]";
  const overlayStyle =
    originalWidth && originalHeight
      ? {
          left: `${(Number(x) / originalWidth) * 100}%`,
          top: `${(Number(y) / originalHeight) * 100}%`,
          width: `${(Number(cropWidth) / originalWidth) * 100}%`,
          height: `${(Number(cropHeight) / originalHeight) * 100}%`,
        }
      : undefined;

  return (
    <ToolPageShell
      title="Crop Image"
      description="Upload an image, set crop values, and download the cropped result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox inputKey={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
          {originalWidth && originalHeight && <div className="rounded-2xl bg-white/70 dark:bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200"><LocalizedText>Original size</LocalizedText>: {originalWidth} x {originalHeight}px</div>}
          <div className="rounded-2xl bg-white/70 dark:bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <LocalizedText>Drag on the original preview to set the crop area, or fine-tune the numbers below.</LocalizedText>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["X", x, setX],
              ["Y", y, setY],
              ["Width", cropWidth, setCropWidth],
              ["Height", cropHeight, setCropHeight],
            ].map(([label, value, setter]) => (
              <label key={label as string} className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>{label as string}</LocalizedText></span>
                <input type="number" value={value as string} onChange={(e) => updateCropValue(setter as (next: string) => void, e.target.value)} className={inputClass} />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600"><LocalizedText>Reset</LocalizedText></button>
          </div>
          <button type="button" onClick={handleCrop} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"><LocalizedText>{loading ? "Cropping..." : "Crop Image"}</LocalizedText></button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && (
          <div className="relative inline-block max-w-full select-none">
            <img
              ref={imageRef}
              src={preview}
              alt="Original preview"
              draggable={false}
              onMouseDown={handleSelectionStart}
              onMouseMove={handleSelectionMove}
              onMouseUp={handleSelectionEnd}
              onMouseLeave={handleSelectionEnd}
              className="max-h-[520px] w-auto max-w-full cursor-crosshair rounded-2xl object-contain"
            />
            {overlayStyle && (
              <div
                className="pointer-events-none absolute rounded-xl border-2 border-indigo-500 bg-indigo-500/20 shadow-[0_0_0_9999px_rgba(15,23,42,0.28)]"
                style={overlayStyle}
              />
            )}
          </div>
        )}
      </PreviewPanel>
      <ResultPanel title="Cropped Image" downloadHref={croppedImage} downloadName={downloadFileName} downloadLabel="Download Cropped Image">
        {croppedImage && <img src={croppedImage} alt="Cropped preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}

