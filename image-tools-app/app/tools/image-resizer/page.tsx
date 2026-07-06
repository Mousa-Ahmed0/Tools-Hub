"use client";

import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import { resizeImage } from "@/lib/image/resize";
import { useI18n } from "@/lib/i18n";
import { revokeObjectUrl } from "@/lib/object-url";

type ResizeHandle = "nw" | "ne" | "sw" | "se";

type DragState = {
  handle: ResizeHandle;
  pointerId: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  scale: number;
};

type ResizeEditorProps = {
  preview: string;
  currentWidth: number;
  currentHeight: number;
  originalWidth: number;
  originalHeight: number;
  lockAspectRatio: boolean;
  onResize: (width: number, height: number) => void;
};

const minResizeDimension = 50;

const handleClasses: Record<ResizeHandle, string> = {
  nw: "-left-3 -top-3 cursor-nwse-resize",
  ne: "-right-3 -top-3 cursor-nesw-resize",
  sw: "-bottom-3 -left-3 cursor-nesw-resize",
  se: "-bottom-3 -right-3 cursor-nwse-resize",
};

const workspacePadding = 40;

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

function clampDimension(value: number) {
  return Math.max(minResizeDimension, Math.round(value));
}

function ResizeEditor({
  preview,
  currentWidth,
  currentHeight,
  originalWidth,
  originalHeight,
  lockAspectRatio,
  onResize,
}: ResizeEditorProps) {
  const { t } = useI18n();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 720, height: 520 });
  const [imagePosition, setImagePosition] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const hasPositionRef = useRef(false);

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

  const editorScale = Math.min(
    Math.max((workspaceSize.width - 80) / originalWidth, 0.05),
    Math.max((workspaceSize.height - 80) / originalHeight, 0.05),
    1
  );
  const displayWidth = Math.max(currentWidth * editorScale, 36);
  const displayHeight = Math.max(currentHeight * editorScale, 36);
  const aspectRatio = originalWidth / originalHeight;

  useEffect(() => {
    hasPositionRef.current = false;
  }, [preview]);

  useEffect(() => {
    if (isDragging || hasPositionRef.current) return;

    setImagePosition({
      left: Math.max(workspacePadding, (workspaceSize.width - displayWidth) / 2),
      top: Math.max(workspacePadding, (workspaceSize.height - displayHeight) / 2),
    });
  }, [displayHeight, displayWidth, isDragging, workspaceSize.height, workspaceSize.width]);

  function applyDragResize(event: PointerEvent<HTMLButtonElement>) {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const horizontalSign = dragState.handle.includes("e") ? 1 : -1;
    const verticalSign = dragState.handle.includes("s") ? 1 : -1;
    const deltaWidth =
      ((event.clientX - dragState.startX) * horizontalSign) / dragState.scale;
    const deltaHeight =
      ((event.clientY - dragState.startY) * verticalSign) / dragState.scale;

    let nextWidth = clampDimension(dragState.startWidth + deltaWidth);
    let nextHeight = clampDimension(dragState.startHeight + deltaHeight);

    if (lockAspectRatio) {
      if (Math.abs(deltaWidth) >= Math.abs(deltaHeight)) {
        nextHeight = clampDimension(nextWidth / aspectRatio);
      } else {
        nextWidth = clampDimension(nextHeight * aspectRatio);
      }
    }

    const nextDisplayWidth = nextWidth * dragState.scale;
    const nextDisplayHeight = nextHeight * dragState.scale;
    const nextLeft = dragState.handle.includes("w")
      ? dragState.startLeft + dragState.startWidth * dragState.scale - nextDisplayWidth
      : dragState.startLeft;
    const nextTop = dragState.handle.includes("n")
      ? dragState.startTop + dragState.startHeight * dragState.scale - nextDisplayHeight
      : dragState.startTop;

    setImagePosition({
      left: Math.round(nextLeft),
      top: Math.round(nextTop),
    });
    onResize(nextWidth, nextHeight);
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, handle: ResizeHandle) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      handle,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: currentWidth,
      startHeight: currentHeight,
      startLeft: imagePosition.left,
      startTop: imagePosition.top,
      scale: editorScale,
    };
    hasPositionRef.current = true;
    setIsDragging(true);
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
  }

  return (
    <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-500">
            {t("toolUi.visualResize")}
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            <LocalizedText>Image Resizer</LocalizedText>
          </h2>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-black text-indigo-600 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_2px_2px_5px_#020617,inset_-2px_-2px_5px_#1e293b]">
          {t("toolUi.currentDimensions", {
            width: currentWidth,
            height: currentHeight,
          })}
        </span>
      </div>

      <div
        ref={workspaceRef}
        className="relative h-[520px] min-h-[420px] touch-pan-y overflow-auto rounded-3xl bg-[#EEF2FF] p-10 shadow-[inset_6px_6px_14px_#d1d9e6,inset_-6px_-6px_14px_#ffffff] dark:bg-slate-950/40 dark:shadow-[inset_6px_6px_14px_#020617,inset_-6px_-6px_14px_#1e293b]"
      >
        <div className="absolute left-5 top-5 z-10 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-[3px_3px_8px_#d1d9e6,-3px_-3px_8px_#ffffff] dark:bg-slate-900/90 dark:text-slate-300 dark:shadow-[3px_3px_8px_#020617,-3px_-3px_8px_#1e293b]">
          {t("toolUi.dragResizeHelp")}
        </div>

        <div
          className={`absolute select-none rounded-2xl outline outline-2 outline-dashed outline-indigo-500/90 transition-shadow ${
            isDragging
              ? "shadow-[0_0_0_8px_rgba(99,102,241,0.18)]"
              : "shadow-[0_0_0_5px_rgba(99,102,241,0.10)]"
          }`}
          style={{
            left: imagePosition.left,
            top: imagePosition.top,
            width: displayWidth,
            height: displayHeight,
          }}
        >
          <img
            src={preview}
            alt="Resize editor"
            draggable={false}
            className="h-full w-full rounded-2xl object-fill"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-indigo-500/5" />

          {(Object.keys(handleClasses) as ResizeHandle[]).map((handle) => (
            <button
              key={handle}
              type="button"
              aria-label={t("toolUi.resizeHandle")}
              onPointerDown={(event) => handlePointerDown(event, handle)}
              onPointerMove={applyDragResize}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              className={`absolute h-8 w-8 touch-none rounded-full border-4 border-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[4px_4px_10px_#c8d0df,-4px_-4px_10px_#ffffff] transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:border-slate-900 dark:shadow-[4px_4px_10px_#020617,-4px_-4px_10px_#1e293b] ${handleClasses[handle]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [currentWidth, setCurrentWidth] = useState(800);
  const [currentHeight, setCurrentHeight] = useState(600);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  function setEditorSize(nextWidth: number, nextHeight: number) {
    setCurrentWidth(clampDimension(nextWidth));
    setCurrentHeight(clampDimension(nextHeight));
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
      setEditorSize(image.width, image.height);
    };

    image.src = objectUrl;
    setFile(selectedFile);
    setPreview(objectUrl);
    setLockAspectRatio(true);
    setLoading(false);
    setError("");
  }

  function handleResetSize() {
    if (!originalWidth || !originalHeight) return;

    setEditorSize(originalWidth, originalHeight);
    setLockAspectRatio(true);
  }

  function handleClear() {
    setFile(null);
    setPreview("");
    setCurrentWidth(800);
    setCurrentHeight(600);
    setOriginalWidth(null);
    setOriginalHeight(null);
    setLockAspectRatio(true);
    setLoading(false);
    setError("");
    setInputKey((current) => current + 1);
  }

  function handleWidthChange(value: string) {
    const nextWidth = Number(value);
    if (!Number.isFinite(nextWidth)) return;

    if (lockAspectRatio && originalWidth && originalHeight) {
      setEditorSize(nextWidth, (nextWidth * originalHeight) / originalWidth);
      return;
    }

    setEditorSize(nextWidth, currentHeight);
  }

  function handleHeightChange(value: string) {
    const nextHeight = Number(value);
    if (!Number.isFinite(nextHeight)) return;

    if (lockAspectRatio && originalWidth && originalHeight) {
      setEditorSize((nextHeight * originalWidth) / originalHeight, nextHeight);
      return;
    }

    setEditorSize(currentWidth, nextHeight);
  }

  async function handleDownload() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await resizeImage(file, currentWidth, currentHeight);
      const link = document.createElement("a");
      link.href = result;
      link.download = `${getBaseName(file.name)}-resized-${currentWidth}x${currentHeight}.png`;
      link.click();
    } catch {
      setError("Something went wrong while resizing the image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <LocalizedText>Visual Resize</LocalizedText>
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            <LocalizedText>Image Resizer</LocalizedText>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            <LocalizedText>Upload an image, resize it directly with corner handles, then download the edited result.</LocalizedText>
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

            <div className="flex items-center gap-3 rounded-2xl bg-[#EEF2FF] px-4 py-3 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
              <input
                id="lock-aspect-ratio"
                type="checkbox"
                checked={lockAspectRatio}
                onChange={(event) => setLockAspectRatio(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label
                htmlFor="lock-aspect-ratio"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <LocalizedText>Lock Aspect Ratio</LocalizedText>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
                  <LocalizedText>Width</LocalizedText>
                </span>
                <input
                  type="number"
                  min={minResizeDimension}
                  value={currentWidth}
                  onChange={(event) => handleWidthChange(event.target.value)}
                  className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
                  <LocalizedText>Height</LocalizedText>
                </span>
                <input
                  type="number"
                  min={minResizeDimension}
                  value={currentHeight}
                  onChange={(event) => handleHeightChange(event.target.value)}
                  className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button
                type="button"
                onClick={handleResetSize}
                disabled={!file}
                className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
              >
                <LocalizedText>Reset</LocalizedText> <LocalizedText>Size</LocalizedText>
              </button>
              <button
                type="button"
                onClick={handleClear}
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
                {loading ? "Resizing..." : "Download Resized Image"}
              </LocalizedText>
            </button>
          </ToolControlsPanel>

          {preview && originalWidth && originalHeight ? (
            <ResizeEditor
              preview={preview}
              currentWidth={currentWidth}
              currentHeight={currentHeight}
              originalWidth={originalWidth}
              originalHeight={originalHeight}
              lockAspectRatio={lockAspectRatio}
              onResize={setEditorSize}
            />
          ) : (
            <section className="flex min-h-[520px] items-center justify-center rounded-3xl bg-[#EEF2FF] p-8 text-center shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  <LocalizedText>Your result will appear here</LocalizedText>
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <LocalizedText>Upload Image</LocalizedText>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
