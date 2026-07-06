"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { translateCommonLabel, useI18n } from "@/lib/i18n";

type FileUploadCardProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  file?: File | null;
  files?: File[];
  inputKey?: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileType(file: File) {
  if (file.type) return file.type.split("/").pop()?.toUpperCase() ?? file.type;
  return file.name.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function FileUploadCard({
  label,
  accept,
  multiple,
  file,
  files,
  inputKey,
  onChange,
}: FileUploadCardProps) {
  const { t } = useI18n();
  const resolvedLabel = translateCommonLabel(t, label) ?? t("common.uploadFile");
  const selectedFiles = files ?? (file ? [file] : []);
  const selectedCount = selectedFiles.length;
  const primaryFile = selectedFiles[0];
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!primaryFile?.type.startsWith("image/")) {
      setThumbnailUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(primaryFile);
    setThumbnailUrl(objectUrl);
    setDimensions("");

    const image = new Image();
    image.onload = () => setDimensions(`${image.width} x ${image.height}px`);
    image.src = objectUrl;

    return () => URL.revokeObjectURL(objectUrl);
  }, [primaryFile]);

  function applyDroppedFiles(droppedFiles: File[]) {
    if (!inputRef.current || !droppedFiles.length) return;

    const dataTransfer = new DataTransfer();
    const nextFiles = multiple ? droppedFiles : droppedFiles.slice(0, 1);

    nextFiles.forEach((nextFile) => dataTransfer.items.add(nextFile));
    inputRef.current.files = dataTransfer.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    applyDroppedFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-slate-100">
        {resolvedLabel}
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-3xl bg-[#EEF2FF] p-4 transition dark:bg-slate-900 ${
          isDragging
            ? "scale-[1.01] shadow-[inset_7px_7px_14px_#c5cede,inset_-7px_-7px_14px_#ffffff] dark:shadow-[inset_7px_7px_14px_#020617,inset_-7px_-7px_14px_#1e293b]"
            : "shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] dark:shadow-[inset_5px_5px_10px_#020617,inset_-5px_-5px_10px_#1e293b]"
        }`}
      >
        <div className="mb-3 rounded-2xl border border-dashed border-indigo-200 bg-white/50 px-4 py-5 text-center dark:border-slate-700 dark:bg-slate-950/60">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {t("common.dropFiles")}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t("common.uploadStarts")}
          </p>
        </div>
        <input
          ref={inputRef}
          key={inputKey}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="block w-full text-sm text-slate-600 file:me-4 file:rounded-2xl file:border-0 file:bg-gradient-to-r file:from-indigo-500 file:to-violet-500 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:opacity-95 dark:text-slate-400"
        />
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 flex gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-emerald-950/40 dark:text-emerald-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-[3px_3px_8px_#d1d9e6,-3px_-3px_8px_#ffffff] dark:shadow-[3px_3px_8px_#020617,-3px_-3px_8px_#1e293b]"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
              <p className="truncate">
                {selectedCount > 1
                  ? t("common.filesUploaded", { count: selectedCount })
                  : t("common.fileUploaded", { name: primaryFile.name })}
              </p>
            </div>
            {primaryFile && selectedCount === 1 && (
              <div className="mt-2 grid gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-300 sm:grid-cols-2">
                <span>{t("common.size")}: {formatFileSize(primaryFile.size)}</span>
                <span>{t("common.type")}: {formatFileType(primaryFile)}</span>
                {dimensions && <span className="sm:col-span-2">{t("common.dimensions")}: {dimensions}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
