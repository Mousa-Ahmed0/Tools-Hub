"use client";

import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import { cropImage } from "@/lib/image/crop";
import { useI18n } from "@/lib/i18n";
import { revokeObjectUrl } from "@/lib/object-url";

type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropHandle = "nw" | "ne" | "sw" | "se";

type DragState =
  | {
      type: "move";
      pointerId: number;
      startX: number;
      startY: number;
      startCrop: CropRect;
      scale: number;
    }
  | {
      type: "resize";
      handle: CropHandle;
      pointerId: number;
      startX: number;
      startY: number;
      startCrop: CropRect;
      scale: number;
    };

type CropEditorProps = {
  preview: string;
  crop: CropRect;
  imageWidth: number;
  imageHeight: number;
  onCropChange: (crop: CropRect) => void;
};

const minCropSize = 20;

const handleClasses: Record<CropHandle, string> = {
  nw: "-left-3 -top-3 cursor-nwse-resize",
  ne: "-right-3 -top-3 cursor-nesw-resize",
  sw: "-bottom-3 -left-3 cursor-nesw-resize",
  se: "-bottom-3 -right-3 cursor-nwse-resize",
};

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundCrop(crop: CropRect): CropRect {
  return {
    x: Math.round(crop.x),
    y: Math.round(crop.y),
    width: Math.round(crop.width),
    height: Math.round(crop.height),
  };
}

function createDefaultCrop(imageWidth: number, imageHeight: number): CropRect {
  const width = Math.max(minCropSize, Math.round(imageWidth * 0.72));
  const height = Math.max(minCropSize, Math.round(imageHeight * 0.72));

  return {
    x: Math.round((imageWidth - width) / 2),
    y: Math.round((imageHeight - height) / 2),
    width,
    height,
  };
}

function constrainCrop(crop: CropRect, imageWidth: number, imageHeight: number) {
  const width = clamp(crop.width, minCropSize, imageWidth);
  const height = clamp(crop.height, minCropSize, imageHeight);

  return roundCrop({
    x: clamp(crop.x, 0, imageWidth - width),
    y: clamp(crop.y, 0, imageHeight - height),
    width,
    height,
  });
}

function CropEditor({
  preview,
  crop,
  imageWidth,
  imageHeight,
  onCropChange,
}: CropEditorProps) {
  const { t } = useI18n();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 760, height: 560 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const observer = new ResizeObserver(([entry]) => {
      setWorkspaceSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(workspace);
    return () => observer.disconnect();
  }, []);

  const imageScale = Math.min(
    Math.max((workspaceSize.width - 80) / imageWidth, 0.05),
    Math.max((workspaceSize.height - 96) / imageHeight, 0.05),
    1
  );
  const displayWidth = imageWidth * imageScale;
  const displayHeight = imageHeight * imageScale;

  function updateDrag(event: PointerEvent<HTMLElement>) {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const deltaX = (event.clientX - dragState.startX) / dragState.scale;
    const deltaY = (event.clientY - dragState.startY) / dragState.scale;
    const startCrop = dragState.startCrop;

    if (dragState.type === "move") {
      onCropChange(
        constrainCrop(
          {
            ...startCrop,
            x: startCrop.x + deltaX,
            y: startCrop.y + deltaY,
          },
          imageWidth,
          imageHeight
        )
      );
      return;
    }

    const right = startCrop.x + startCrop.width;
    const bottom = startCrop.y + startCrop.height;
    let nextCrop = startCrop;

    if (dragState.handle === "nw") {
      const nextX = clamp(startCrop.x + deltaX, 0, right - minCropSize);
      const nextY = clamp(startCrop.y + deltaY, 0, bottom - minCropSize);
      nextCrop = {
        x: nextX,
        y: nextY,
        width: right - nextX,
        height: bottom - nextY,
      };
    }

    if (dragState.handle === "ne") {
      const nextY = clamp(startCrop.y + deltaY, 0, bottom - minCropSize);
      nextCrop = {
        x: startCrop.x,
        y: nextY,
        width: clamp(startCrop.width + deltaX, minCropSize, imageWidth - startCrop.x),
        height: bottom - nextY,
      };
    }

    if (dragState.handle === "sw") {
      const nextX = clamp(startCrop.x + deltaX, 0, right - minCropSize);
      nextCrop = {
        x: nextX,
        y: startCrop.y,
        width: right - nextX,
        height: clamp(startCrop.height + deltaY, minCropSize, imageHeight - startCrop.y),
      };
    }

    if (dragState.handle === "se") {
      nextCrop = {
        x: startCrop.x,
        y: startCrop.y,
        width: clamp(startCrop.width + deltaX, minCropSize, imageWidth - startCrop.x),
        height: clamp(startCrop.height + deltaY, minCropSize, imageHeight - startCrop.y),
      };
    }

    onCropChange(constrainCrop(nextCrop, imageWidth, imageHeight));
  }

  function startMove(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      type: "move",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCrop: crop,
      scale: imageScale,
    };
    setIsDragging(true);
  }

  function startResize(event: PointerEvent<HTMLButtonElement>, handle: CropHandle) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      type: "resize",
      handle,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCrop: crop,
      scale: imageScale,
    };
    setIsDragging(true);
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
  }

  return (
    <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-500">
            <LocalizedText>Crop Image</LocalizedText>
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            <LocalizedText>Image Preview</LocalizedText>
          </h2>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-black text-indigo-600 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_2px_2px_5px_#020617,inset_-2px_-2px_5px_#1e293b]">
          {t("toolUi.currentDimensions", {
            width: crop.width,
            height: crop.height,
          })}
        </span>
      </div>

      <div
        ref={workspaceRef}
        className="flex h-[560px] min-h-[440px] touch-pan-y items-center justify-center overflow-auto rounded-3xl bg-[#EEF2FF] p-10 shadow-[inset_6px_6px_14px_#d1d9e6,inset_-6px_-6px_14px_#ffffff] dark:bg-slate-950/40 dark:shadow-[inset_6px_6px_14px_#020617,inset_-6px_-6px_14px_#1e293b]"
      >
        <div
          className="relative shrink-0 select-none overflow-hidden rounded-2xl shadow-[5px_5px_14px_#c8d0df,-5px_-5px_14px_#ffffff] dark:shadow-[5px_5px_14px_#020617,-5px_-5px_14px_#1e293b]"
          style={{ width: displayWidth, height: displayHeight }}
        >
          <img
            src={preview}
            alt="Crop editor"
            draggable={false}
            className="h-full w-full object-fill"
          />

          <div className="pointer-events-none absolute inset-0 bg-slate-950/40" />

          <div
            onPointerDown={startMove}
            onPointerMove={updateDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`absolute cursor-move touch-none rounded-xl border-2 border-white bg-transparent outline outline-2 outline-indigo-500/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.38)] ${
              isDragging ? "ring-4 ring-indigo-400/40" : ""
            }`}
            style={{
              left: crop.x * imageScale,
              top: crop.y * imageScale,
              width: crop.width * imageScale,
              height: crop.height * imageScale,
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white/5" />
            {(Object.keys(handleClasses) as CropHandle[]).map((handle) => (
              <button
                key={handle}
                type="button"
                aria-label={t("toolUi.resizeHandle")}
                onPointerDown={(event) => startResize(event, handle)}
                onPointerMove={updateDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={`absolute h-8 w-8 touch-none rounded-full border-4 border-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[4px_4px_10px_#1e293b66] transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${handleClasses[handle]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CropImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function updateCrop(nextCrop: CropRect) {
    if (!originalWidth || !originalHeight) {
      setCrop(roundCrop(nextCrop));
      return;
    }

    setCrop(constrainCrop(nextCrop, originalWidth, originalHeight));
    setError("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const image = new Image();

    image.onload = () => {
      setOriginalWidth(image.width);
      setOriginalHeight(image.height);
      setCrop(createDefaultCrop(image.width, image.height));
    };

    image.src = objectUrl;
    setFile(selectedFile);
    setPreview(objectUrl);
    setLoading(false);
    setError("");
  }

  function handleResetCrop() {
    if (!originalWidth || !originalHeight) return;

    setCrop(createDefaultCrop(originalWidth, originalHeight));
    setError("");
  }

  function handleClearImage() {
    setFile(null);
    setPreview("");
    setCrop({ x: 0, y: 0, width: 200, height: 200 });
    setOriginalWidth(null);
    setOriginalHeight(null);
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  function handleNumericChange(field: keyof CropRect, value: string) {
    const nextValue = Number(value);
    if (!Number.isFinite(nextValue)) return;

    updateCrop({
      ...crop,
      [field]: nextValue,
    });
  }

  async function handleDownload() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    if (!crop.width || !crop.height || crop.width <= 0 || crop.height <= 0) {
      setError("Please enter valid crop values.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await cropImage(file, crop.x, crop.y, crop.width, crop.height);
      const link = document.createElement("a");

      link.href = result;
      link.download = `${getBaseName(file.name)}-crop-${crop.width}x${crop.height}.png`;
      link.click();
    } catch {
      setError("Something went wrong while cropping the image.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]";

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <LocalizedText>Crop Image</LocalizedText>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            <LocalizedText>Crop Image</LocalizedText>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            <LocalizedText>Drag on the original preview to set the crop area, or fine-tune the numbers below.</LocalizedText>
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <ToolControlsPanel error={error}>
            <FileUploadBox
              inputKey={inputKey}
              label="Upload Image"
              accept="image/*"
              file={file}
              onChange={handleFileChange}
            />

            {originalWidth && originalHeight && (
              <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
                <LocalizedText>Original size</LocalizedText>: {originalWidth} x {originalHeight}px
              </div>
            )}

            <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-black text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
              {crop.width} x {crop.height}px
            </div>

            <details className="rounded-2xl bg-white/60 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
              <summary className="cursor-pointer font-bold">
                <LocalizedText>Settings</LocalizedText>
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  ["X", "x"],
                  ["Y", "y"],
                  ["Width", "width"],
                  ["Height", "height"],
                ].map(([label, field]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
                      <LocalizedText>{label}</LocalizedText>
                    </span>
                    <input
                      type="number"
                      value={crop[field as keyof CropRect]}
                      onChange={(event) =>
                        handleNumericChange(field as keyof CropRect, event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                ))}
              </div>
            </details>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button
                type="button"
                onClick={handleResetCrop}
                disabled={!file}
                className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
              >
                <LocalizedText>Reset</LocalizedText> <LocalizedText>Crop Image</LocalizedText>
              </button>
              <button
                type="button"
                onClick={handleClearImage}
                className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
              >
                <LocalizedText>Clear</LocalizedText>
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!file || loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
            >
              <LocalizedText>
                {loading ? "Cropping..." : "Download Cropped Image"}
              </LocalizedText>
            </button>
          </ToolControlsPanel>

          {preview && originalWidth && originalHeight ? (
            <CropEditor
              preview={preview}
              crop={crop}
              imageWidth={originalWidth}
              imageHeight={originalHeight}
              onCropChange={updateCrop}
            />
          ) : (
            <section className="flex min-h-[560px] items-center justify-center rounded-3xl bg-[#EEF2FF] p-8 text-center shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  <LocalizedText>Upload Image</LocalizedText>
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <LocalizedText>Your result will appear here</LocalizedText>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
