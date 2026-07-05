import { ReactNode } from "react";

type ToolControlsPanelProps = {
  children: ReactNode;
  error?: string;
};

export default function ToolControlsPanel({
  children,
  error,
}: ToolControlsPanelProps) {
  return (
    <aside className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
      <h2 className="text-xl font-bold text-slate-900">Controls</h2>
      <div className="mt-6 space-y-6">{children}</div>
      {error && <p className="mt-5 text-sm font-semibold text-red-600">{error}</p>}
    </aside>
  );
}
