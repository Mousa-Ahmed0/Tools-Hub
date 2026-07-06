"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import { WatermarkPosition } from "@/lib/image/watermark";
import { revokeObjectUrl } from "@/lib/object-url";

type WatermarkPoint = { x: number; y: number };

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

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not load image."));
      image.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function presetPoint(position: WatermarkPosition, imageWidth: number, imageHeight: number): WatermarkPoint {
  const margin = Math.max(24, Math.round(Math.min(imageWidth, imageHeight) * 0.06));
  const points: Record<WatermarkPosition, WatermarkPoint> = {
    "top-left": { x: margin, y: margin },
    "top-right": { x: imageWidth - margin, y: margin },
    center: { x: imageWidth / 2, y: imageHeight / 2 },
    "bottom-left": { x: margin, y: imageHeight - margin },
    "bottom-right": { x: imageWidth - margin, y: imageHeight - margin },
  };
  return points[position];
}

export default function ImageWatermarkPage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [text, setText] = useState("Image Tools Hub");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [watermarkPoint, setWatermarkPoint] = useState<WatermarkPoint>({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [opacity, setOpacity] = useState("0.6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("48");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const opacityPercent = useMemo(() => Math.round(Number(opacity) * 100), [opacity]);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  useEffect(() => {
    return () => revokeObjectUrl(logoPreview);
  }, [logoPreview]);

  function setPresetPosition(nextPosition: WatermarkPosition, width = imageSize.width, height = imageSize.height) {
    setPosition(nextPosition);
    if (width && height) setWatermarkPoint(presetPoint(nextPosition, width, height));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
      setWatermarkPoint(presetPoint(position, image.width, image.height));
    };
    image.src = objectUrl;

    setFile(selectedFile);
    setPreview(objectUrl);
    setError("");
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setLogoFile(selectedFile);
    setLogoPreview(selectedFile ? URL.createObjectURL(selectedFile) : "");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setLogoFile(null);
    setPreview("");
    setLogoPreview("");
    setText("Image Tools Hub");
    setPosition("bottom-right");
    setWatermarkPoint({ x: 0, y: 0 });
    setImageSize({ width: 0, height: 0 });
    setOpacity("0.6");
    setTextColor("#ffffff");
    setFontSize("48");
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  function getImageScale() {
    const image = imageRef.current;
    if (!image || !imageSize.width || !imageSize.height) return 1;
    return image.getBoundingClientRect().width / imageSize.width;
  }

  function handleWatermarkPointerDown(event: PointerEvent<HTMLDivElement>) {
    const image = imageRef.current;
    if (!image) return;
    const rect = image.getBoundingClientRect();
    const scale = getImageScale();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: (event.clientX - rect.left) / scale - watermarkPoint.x,
      offsetY: (event.clientY - rect.top) / scale - watermarkPoint.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleWatermarkPointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragRef.current;
    const image = imageRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId || !image) return;

    const rect = image.getBoundingClientRect();
    const scale = getImageScale();
    setWatermarkPoint({
      x: clamp((event.clientX - rect.left) / scale - dragState.offsetX, 0, imageSize.width),
      y: clamp((event.clientY - rect.top) / scale - dragState.offsetY, 0, imageSize.height),
    });
  }

  function handleWatermarkPointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  async function handleDownload() {
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
      const [image, logo] = await Promise.all([
        loadImageFromFile(file),
        logoFile ? loadImageFromFile(logoFile) : Promise.resolve(null),
      ]);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create canvas context.");

      context.drawImage(image, 0, 0);
      context.save();
      context.globalAlpha = parsedOpacity;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `700 ${parsedFontSize}px Arial, Helvetica, sans-serif`;
      context.fillStyle = textColor;
      context.shadowColor = "rgba(0,0,0,0.35)";
      context.shadowBlur = Math.max(2, Math.round(parsedFontSize * 0.1));

      let drawY = watermarkPoint.y;
      if (logo) {
        const logoWidth = Math.min(image.width * 0.25, 180);
        const logoScale = Math.min(logoWidth / logo.width, 1);
        const drawWidth = logo.width * logoScale;
        const drawHeight = logo.height * logoScale;
        context.drawImage(logo, watermarkPoint.x - drawWidth / 2, drawY - drawHeight / 2, drawWidth, drawHeight);
        drawY += drawHeight / 2 + parsedFontSize * 0.8;
      }
      if (text.trim()) context.fillText(text, watermarkPoint.x, drawY);
      context.restore();

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${getBaseName(file.name)}-watermark.png`;
      link.click();
    } catch {
      setError("Something went wrong while adding the watermark.");
    } finally {
      setLoading(false);
    }
  }

  const scale = getImageScale();

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <LocalizedText>Image Watermark</LocalizedText>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            <LocalizedText>Image Watermark</LocalizedText>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            <LocalizedText>Upload an image, add a text or logo watermark, preview it, and download a PNG result.</LocalizedText>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <ToolControlsPanel error={error}>
            <FileUploadBox key={`image-${inputKey}`} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Watermark Text</LocalizedText></span>
              <input type="text" value={text} onChange={(event) => setText(event.target.value)} className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]" />
            </label>
            <FileUploadBox key={`logo-${inputKey}`} label="Optional Logo Watermark" accept="image/*" file={logoFile} onChange={handleLogoChange} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Position</LocalizedText></span>
                <select value={position} onChange={(event) => setPresetPosition(event.target.value as WatermarkPosition)} className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
                  {positions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Text Color</LocalizedText></span>
                <input type="color" value={textColor} onChange={(event) => setTextColor(event.target.value)} className="h-12 w-full rounded-2xl border-0 bg-[#EEF2FF] px-2 py-2 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Font Size</LocalizedText></span>
                <input type="number" min="8" max="240" value={fontSize} onChange={(event) => setFontSize(event.target.value)} className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Opacity</LocalizedText> ({opacityPercent}%)</span>
                <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(event) => setOpacity(event.target.value)} className="w-full accent-indigo-500" />
              </label>
            </div>

            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"><LocalizedText>Reset</LocalizedText></button>
            <button type="button" onClick={handleDownload} disabled={!file || loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
              <LocalizedText>{loading ? "Adding Watermark..." : "Download Watermarked Image"}</LocalizedText>
            </button>
          </ToolControlsPanel>

          <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
            <div className="flex min-h-[560px] items-center justify-center overflow-auto rounded-3xl bg-[#EEF2FF] p-10 shadow-[inset_6px_6px_14px_#d1d9e6,inset_-6px_-6px_14px_#ffffff] dark:bg-slate-950/40 dark:shadow-[inset_6px_6px_14px_#020617,inset_-6px_-6px_14px_#1e293b]">
              {preview ? (
                <div className="relative inline-block max-w-full">
                  <img ref={imageRef} src={preview} alt="Watermark editor" draggable={false} className="max-h-[500px] max-w-full rounded-2xl object-contain" />
                  <div
                    onPointerDown={handleWatermarkPointerDown}
                    onPointerMove={handleWatermarkPointerMove}
                    onPointerUp={handleWatermarkPointerEnd}
                    onPointerCancel={handleWatermarkPointerEnd}
                    className="absolute cursor-move touch-none select-none rounded-xl border border-dashed border-white/80 px-3 py-2 text-center font-black shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                    style={{
                      left: watermarkPoint.x * scale,
                      top: watermarkPoint.y * scale,
                      transform: "translate(-50%, -50%)",
                      color: textColor,
                      opacity: Number(opacity),
                      fontSize: Math.max(12, Number(fontSize) * scale),
                    }}
                  >
                    {logoPreview && <img src={logoPreview} alt="" className="mx-auto mb-1 max-h-16 max-w-24 object-contain" />}
                    {text}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Upload Image</LocalizedText></p>
                  <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400"><LocalizedText>Your result will appear here</LocalizedText></p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
