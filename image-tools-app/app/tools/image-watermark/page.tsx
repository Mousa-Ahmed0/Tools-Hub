"use client";

import { ChangeEvent, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { WatermarkPosition, watermarkImage } from "@/lib/image/watermark";

const positions: { label: string; value: WatermarkPosition }[] = [
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
  { label: "Center", value: "center" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
];

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function ImageWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [watermarkedImage, setWatermarkedImage] = useState("");
  const [text, setText] = useState("Image Tools Hub");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState("0.6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("48");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("watermarked-image.png");
  const [inputKey, setInputKey] = useState(0);

  const opacityPercent = useMemo(() => Math.round(Number(opacity) * 100), [opacity]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setWatermarkedImage("");
    setError("");
    setDownloadFileName(`${getBaseName(selectedFile.name)}-watermark.png`);
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    setLogoFile(selectedFile);
    setWatermarkedImage("");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setLogoFile(null);
    setPreview("");
    setWatermarkedImage("");
    setText("Image Tools Hub");
    setPosition("bottom-right");
    setOpacity("0.6");
    setTextColor("#ffffff");
    setFontSize("48");
    setError("");
    setDownloadFileName("watermarked-image.png");
    setInputKey((current) => current + 1);
  }

  async function handleWatermark() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const parsedOpacity = Number(opacity);
    const parsedFontSize = Number(fontSize);

    if (Number.isNaN(parsedOpacity) || parsedOpacity < 0.1 || parsedOpacity > 1) {
      setError("Please choose an opacity between 10% and 100%.");
      return;
    }

    if (!parsedFontSize || parsedFontSize < 8 || parsedFontSize > 240) {
      setError("Please enter a font size between 8 and 240.");
      return;
    }

    if (!text.trim() && !logoFile) {
      setError("Add watermark text or upload a logo image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await watermarkImage(file, {
        text,
        logoFile,
        position,
        opacity: parsedOpacity,
        textColor,
        fontSize: parsedFontSize,
      });

      setWatermarkedImage(result);
      setDownloadFileName(`${getBaseName(file.name)}-watermark.png`);
    } catch {
      setError("Something went wrong while adding the watermark.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Image Watermark"
      description="Upload an image, add a text or logo watermark, preview it, and download a PNG result."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            key={`image-${inputKey}`}
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">Watermark Text</span>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setWatermarkedImage("");
              }}
              placeholder="Enter watermark text"
              className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
            />
          </label>

          <FileUploadBox
            key={`logo-${inputKey}`}
            label="Optional Logo Watermark"
            accept="image/*"
            file={logoFile}
            onChange={handleLogoChange}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Position</span>
              <select
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value as WatermarkPosition);
                  setWatermarkedImage("");
                }}
                className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
              >
                {positions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Text Color</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value);
                  setWatermarkedImage("");
                }}
                className="h-12 w-full rounded-2xl border-0 bg-[#EEF2FF] px-2 py-2 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Font Size</span>
              <input
                type="number"
                min="8"
                max="240"
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  setWatermarkedImage("");
                }}
                className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900">Opacity ({opacityPercent}%)</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => {
                  setOpacity(e.target.value);
                  setWatermarkedImage("");
                }}
                className="w-full accent-indigo-500"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleWatermark}
              disabled={loading}
              className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding Watermark..." : "Add Watermark"}
            </button>
          </div>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>

      <ResultPanel
        title="Watermarked Image"
        downloadHref={watermarkedImage}
        downloadName={downloadFileName}
        downloadLabel="Download Watermarked Image"
      >
        {watermarkedImage && <img src={watermarkedImage} alt="Watermarked preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
