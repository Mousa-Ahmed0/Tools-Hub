"use client";

import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import { revokeObjectUrl } from "@/lib/object-url";
import {
  PassportPhotoPreset,
  PassportPhotoPresetKey,
  passportPhotoPresets,
} from "@/lib/image/passport-photo";

type Offset = { x: number; y: number };

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

function getContainSize(imageWidth: number, imageHeight: number, preset: PassportPhotoPreset, zoom: number) {
  const imageRatio = imageWidth / imageHeight;
  const frameRatio = preset.width / preset.height;
  let width = preset.width;
  let height = preset.height;

  if (imageRatio > frameRatio) {
    width = preset.width;
    height = preset.width / imageRatio;
  } else {
    height = preset.height;
    width = preset.height * imageRatio;
  }

  return {
    width: width * zoom,
    height: height * zoom,
  };
}

export default function PassportPhotoMakerPage() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; startOffset: Offset; scale: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedPresetKey, setSelectedPresetKey] =
    useState<PassportPhotoPresetKey>("us-passport");
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState("1");
  const [frameScale, setFrameScale] = useState(0.75);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const selectedPreset =
    passportPhotoPresets.find((preset) => preset.key === selectedPresetKey) ??
    passportPhotoPresets[0];
  const zoomValue = Number(zoom) || 1;
  const drawSize = imageSize.width && imageSize.height
    ? getContainSize(imageSize.width, imageSize.height, selectedPreset, zoomValue)
    : { width: 0, height: 0 };

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      setFrameScale(
        Math.min(
          (entry.contentRect.width - 32) / selectedPreset.width,
          520 / selectedPreset.height,
          1
        )
      );
    });

    observer.observe(frame);
    return () => observer.disconnect();
  }, [selectedPreset.height, selectedPreset.width]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const image = new Image();
    image.onload = () => setImageSize({ width: image.width, height: image.height });
    image.src = objectUrl;

    setFile(selectedFile);
    setPreview(objectUrl);
    setOffset({ x: 0, y: 0 });
    setZoom("1");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setImageSize({ width: 0, height: 0 });
    setSelectedPresetKey("us-passport");
    setOffset({ x: 0, y: 0 });
    setZoom("1");
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  function handlePresetChange(key: PassportPhotoPresetKey) {
    setSelectedPresetKey(key);
    setOffset({ x: 0, y: 0 });
    setZoom("1");
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offset,
      scale: frameScale,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    setOffset({
      x: dragState.startOffset.x + (event.clientX - dragState.startX) / dragState.scale,
      y: dragState.startOffset.y + (event.clientY - dragState.startY) / dragState.scale,
    });
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  async function handleDownload() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const image = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = selectedPreset.width;
      canvas.height = selectedPreset.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create canvas context.");

      const outputDrawSize = getContainSize(image.width, image.height, selectedPreset, zoomValue);
      const x = (selectedPreset.width - outputDrawSize.width) / 2 + offset.x;
      const y = (selectedPreset.height - outputDrawSize.height) / 2 + offset.y;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, outputDrawSize.width, outputDrawSize.height);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${getBaseName(file.name)}-passport-photo.png`;
      link.click();
    } catch {
      setError("Something went wrong while creating the passport photo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <LocalizedText>Passport Photo Maker</LocalizedText>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            <LocalizedText>Passport Photo Maker</LocalizedText>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            <LocalizedText>Upload an image, choose a photo size, and create a white-background PNG.</LocalizedText>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <ToolControlsPanel error={error}>
            <FileUploadBox key={inputKey} label="Upload Image" accept="image/*" file={file} onChange={handleFileChange} />

            <div>
              <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-slate-100"><LocalizedText>Photo Size</LocalizedText></label>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {passportPhotoPresets.map((preset) => (
                  <button key={preset.key} type="button" onClick={() => handlePresetChange(preset.key)} className={`rounded-2xl px-4 py-3 text-start text-sm font-bold transition ${selectedPresetKey === preset.key ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]" : "bg-[#EEF2FF] text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"}`}>
                    <span className="block"><LocalizedText>{preset.label}</LocalizedText></span>
                    <span className="mt-1 block text-xs opacity-80"><LocalizedText>{preset.description}</LocalizedText></span>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">Zoom ({Math.round(zoomValue * 100)}%)</span>
              <input type="range" min="0.5" max="2" step="0.05" value={zoom} onChange={(event) => setZoom(event.target.value)} className="w-full accent-indigo-500" />
            </label>

            <div className="rounded-2xl bg-white/70 px-4 py-3 text-xs font-semibold leading-5 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
              This tool does not guarantee official passport compliance.
            </div>

            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"><LocalizedText>Reset</LocalizedText></button>
            <button type="button" onClick={handleDownload} disabled={!file || loading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
              <LocalizedText>{loading ? "Generating..." : "Download PNG"}</LocalizedText>
            </button>
          </ToolControlsPanel>

          <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
            <div ref={frameRef} className="flex min-h-[560px] items-center justify-center overflow-auto rounded-3xl bg-[#EEF2FF] p-10 shadow-[inset_6px_6px_14px_#d1d9e6,inset_-6px_-6px_14px_#ffffff] dark:bg-slate-950/40 dark:shadow-[inset_6px_6px_14px_#020617,inset_-6px_-6px_14px_#1e293b]">
              <div className="relative overflow-hidden bg-white shadow-[5px_5px_14px_#c8d0df,-5px_-5px_14px_#ffffff] dark:shadow-[5px_5px_14px_#020617,-5px_-5px_14px_#1e293b]" style={{ width: selectedPreset.width * frameScale, height: selectedPreset.height * frameScale }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Passport editor"
                    draggable={false}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                    className="absolute cursor-move touch-none select-none object-fill"
                    style={{
                      width: drawSize.width * frameScale,
                      height: drawSize.height * frameScale,
                      left: ((selectedPreset.width - drawSize.width) / 2 + offset.x) * frameScale,
                      top: ((selectedPreset.height - drawSize.height) / 2 + offset.y) * frameScale,
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="text-xl font-bold text-slate-900"><LocalizedText>Upload Image</LocalizedText></p>
                      <p className="mt-2 text-sm font-semibold text-slate-500"><LocalizedText>Your result will appear here</LocalizedText></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
