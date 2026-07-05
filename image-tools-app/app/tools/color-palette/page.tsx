"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import FileUploadBox from "@/components/tools/FileUploadBox";
import LocalizedText from "@/components/tools/LocalizedText";
import PreviewPanel from "@/components/tools/PreviewPanel";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PaletteColor, extractColorPalette } from "@/lib/image/color-palette";
import { revokeObjectUrl } from "@/lib/object-url";

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function ColorPalettePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [copiedHex, setCopiedHex] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const paletteFileName = file ? `${getBaseName(file.name)}-palette.json` : "color-palette.json";

  const paletteJson = useMemo(
    () =>
      JSON.stringify(
        palette.map((color) => ({
          hex: color.hex,
          rgb: color.rgb,
          count: color.count,
        })),
        null,
        2
      ),
    [palette]
  );

  const paletteDownloadUrl = useMemo(() => {
    if (!palette.length) return "";

    const blob = new Blob([paletteJson], { type: "application/json" });
    return URL.createObjectURL(blob);
  }, [palette.length, paletteJson]);

  useEffect(() => {
    return () => revokeObjectUrl(preview);
  }, [preview]);

  useEffect(() => {
    return () => revokeObjectUrl(paletteDownloadUrl);
  }, [paletteDownloadUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPalette([]);
    setCopiedHex("");
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview("");
    setPalette([]);
    setCopiedHex("");
    setError("");
    setInputKey((current) => current + 1);
  }

  async function handleExtractPalette() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopiedHex("");

      const result = await extractColorPalette(file, 5);

      if (!result.length) {
        setError("No visible colors could be extracted from this image.");
        return;
      }

      setPalette(result);
    } catch {
      setError("Something went wrong while extracting the color palette.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
    } catch {
      setError("Could not copy the HEX code.");
    }
  }

  return (
    <ToolPageShell
      title="Color Palette Extractor"
      description="Upload an image and extract the top five dominant colors as copyable HEX codes."
      controls={
        <ToolControlsPanel error={error}>
          <FileUploadBox
            key={inputKey}
            label="Upload Image"
            accept="image/*"
            file={file}
            onChange={handleFileChange}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:text-indigo-600"
            >
              <LocalizedText>Reset</LocalizedText>
            </button>
          </div>
          <button
            type="button"
            onClick={handleExtractPalette}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LocalizedText>{loading ? "Extracting..." : "Extract Palette"}</LocalizedText>
          </button>
        </ToolControlsPanel>
      }
    >
      <PreviewPanel title="Original Preview">
        {preview && <img src={preview} alt="Original preview" className="max-h-[520px] w-auto max-w-full rounded-2xl object-contain" />}
      </PreviewPanel>

      <ResultPanel
        title="Dominant Colors"
        downloadHref={paletteDownloadUrl}
        downloadName={paletteFileName}
        downloadLabel="Download JSON"
        emptyText="Your extracted palette will appear here."
      >
        {palette.length > 0 && (
          <div className="w-full space-y-3">
            {palette.map((color) => (
              <div key={color.hex} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/70 dark:bg-slate-950/70 p-3">
                <div className="h-12 w-16 rounded-xl shadow-[inset_3px_3px_7px_rgba(15,23,42,0.12),inset_-3px_-3px_7px_rgba(255,255,255,0.45)]" style={{ backgroundColor: color.hex }} aria-label={`Color ${color.hex}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{color.hex}</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    RGB {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(color.hex)}
                  className="inline-flex rounded-2xl bg-[#EEF2FF] dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] transition hover:text-indigo-600"
                >
                  <LocalizedText>{copiedHex === color.hex ? "Copied" : "Copy"}</LocalizedText>
                </button>
              </div>
            ))}
          </div>
        )}
      </ResultPanel>
    </ToolPageShell>
  );
}

