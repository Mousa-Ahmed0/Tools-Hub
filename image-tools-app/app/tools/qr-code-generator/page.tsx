"use client";

import { useState } from "react";
import ResultPanel from "@/components/tools/ResultPanel";
import ToolControlsPanel from "@/components/tools/ToolControlsPanel";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { generateQrCode } from "@/lib/image/qr-code";

export default function QrCodeGeneratorPage() {
  const [inputValue, setInputValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleReset() {
    setInputValue("");
    setQrCode("");
    setError("");
  }

  async function handleGenerate() {
    if (!inputValue.trim()) {
      setError("Please enter text or a URL first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const result = await generateQrCode(inputValue);
      setQrCode(result);
    } catch {
      setError("Something went wrong while generating the QR code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="QR Code Generator"
      description="Enter text or a URL, generate a QR code, and download it as a PNG."
      controls={
        <ToolControlsPanel error={error}>
          <label className="block">
            <span className="mb-3 block text-sm font-bold text-slate-900">Text or URL</span>
            <textarea value={inputValue} onChange={(event) => { setInputValue(event.target.value); setQrCode(""); setError(""); }} rows={6} placeholder="https://example.com" className="w-full resize-y rounded-2xl border-0 bg-[#EEF2FF] px-4 py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="rounded-2xl bg-[#EEF2FF] px-5 py-3 text-sm font-bold text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition hover:text-indigo-600">Reset</button>
            <button type="button" onClick={handleGenerate} disabled={loading} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Generating..." : "Generate QR Code"}</button>
          </div>
        </ToolControlsPanel>
      }
    >
      <ResultPanel title="QR Preview" downloadHref={qrCode} downloadName="qr-code.png" downloadLabel="Download QR Code">
        {qrCode && <img src={qrCode} alt="Generated QR code" className="h-auto w-full max-w-[320px] rounded-2xl bg-white" />}
      </ResultPanel>
    </ToolPageShell>
  );
}
