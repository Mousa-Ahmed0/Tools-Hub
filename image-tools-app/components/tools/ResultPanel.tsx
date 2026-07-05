import { ReactNode } from "react";

type ResultPanelProps = {
  title: string;
  children?: ReactNode;
  downloadHref?: string;
  downloadName?: string;
  downloadLabel?: string;
  emptyText?: string;
};

export default function ResultPanel({
  title,
  children,
  downloadHref,
  downloadName,
  downloadLabel = "Download Result",
  emptyText = "Your result will appear here.",
}: ResultPanelProps) {
  return (
    <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {downloadHref && (
          <a
            href={downloadHref}
            download={downloadName}
            className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95"
          >
            {downloadLabel}
          </a>
        )}
      </div>
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-[#EEF2FF] p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
        {children || <p className="text-center text-sm text-slate-500">{emptyText}</p>}
      </div>
    </section>
  );
}
