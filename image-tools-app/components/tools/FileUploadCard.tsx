"use client";

import { ChangeEvent, useEffect, useState } from "react";

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
  label = "Upload File",
  accept,
  multiple,
  file,
  files,
  inputKey,
  onChange,
}: FileUploadCardProps) {
  const selectedFiles = files ?? (file ? [file] : []);
  const selectedCount = selectedFiles.length;
  const primaryFile = selectedFiles[0];
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    if (!primaryFile?.type.startsWith("image/")) {
      setThumbnailUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(primaryFile);
    setThumbnailUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [primaryFile]);

  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-slate-900">
        {label}
      </label>
      <div className="rounded-3xl bg-[#EEF2FF] p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
        <input
          key={inputKey}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-2xl file:border-0 file:bg-gradient-to-r file:from-indigo-500 file:to-violet-500 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:opacity-95"
        />
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 flex gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff]">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-[3px_3px_8px_#d1d9e6,-3px_-3px_8px_#ffffff]"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
              <p className="truncate">
                {selectedCount > 1
                  ? `${selectedCount} files uploaded successfully`
                  : `${primaryFile.name} uploaded successfully`}
              </p>
            </div>
            {primaryFile && selectedCount === 1 && (
              <div className="mt-2 grid gap-1 text-xs font-bold text-emerald-600 sm:grid-cols-2">
                <span>Size: {formatFileSize(primaryFile.size)}</span>
                <span>Type: {formatFileType(primaryFile)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
