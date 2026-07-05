"use client";

import { ChangeEvent, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { cropImage } from "@/lib/image/crop";

export default function CropImagePage() {
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
    if (!originalWidth || !originalHeight) return;
    setX("0");
    setY("0");
    setCropWidth(String(Math.min(200, originalWidth)));
    setCropHeight(String(Math.min(200, originalHeight)));
    setCroppedImage("");
    setError("");
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

  const inputClass = "w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]";

  return (
    <ToolPageShell
      title="Crop Image"
      description="Upload an image, set crop values, and download the cropped result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
          {originalWidth && originalHeight && <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700">Original size: {originalWidth} x {originalHeight}px</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["X", x, setX],
              ["Y", y, setY],
              ["Width", cropWidth, setCropWidth],
              ["Height", cropHeight, setCropHeight],
            ].map(([label, value, setter]) => (
              <label key={label as string} className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900">{label as string}</span>
                <input type="number" value={value as string} onChange={(e) => (setter as (next: string) => void)(e.target.value)} className={inputClass} />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
            <button type="button" onClick={handleCrop} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Cropping..." : "Crop Image"}</button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>
      <ResultPanel title="Cropped Image" downloadHref={croppedImage} downloadName={downloadFileName} downloadLabel="Download Cropped Image">
        {croppedImage && <img src={croppedImage} alt="Cropped preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
