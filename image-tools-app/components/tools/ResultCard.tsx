import { ReactNode } from "react";
import EmptyState from "./EmptyState";

type ResultCardProps = {
  title: string;
  children?: ReactNode;
  downloadHref?: string;
  downloadName?: string;
  downloadLabel?: string;
  emptyText?: string;
  meta?: string;
};

export default function ResultCard({
  title,
  children,
  downloadHref,
  downloadName,
  downloadLabel = "Download Result",
  emptyText = "Your result will appear here.",
  meta,
}: ResultCardProps) {
  return (
    <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-violet-500">
            Result
          </p>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        {meta && (
          <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]">
            {meta}
          </span>
        )}
      </div>
      <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl bg-[#EEF2FF] p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] lg:min-h-[360px]">
        {children || <EmptyState text={emptyText} iconLabel={title} />}
      </div>
      {downloadHref && (
        <div className="mt-4 rounded-3xl bg-white/60 p-3 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff]">
          <a
            href={downloadHref}
            download={downloadName}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95"
          >
            {downloadLabel}
          </a>
        </div>
      )}
    </section>
  );
}
