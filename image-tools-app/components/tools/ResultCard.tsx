"use client";

import { ReactNode } from "react";
import { translateCommonLabel, useI18n } from "@/lib/i18n";
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
  downloadLabel,
  emptyText,
  meta,
}: ResultCardProps) {
  const { t } = useI18n();
  const resolvedTitle = translateCommonLabel(t, title) ?? title;
  const resolvedDownloadLabel =
    translateCommonLabel(t, downloadLabel) ?? t("common.downloadResult");

  return (
    <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-violet-500">
            {t("common.result")}
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{resolvedTitle}</h2>
        </div>
        {meta && (
          <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] dark:bg-slate-950/70 dark:text-slate-300 dark:shadow-[inset_2px_2px_5px_#020617,inset_-2px_-2px_5px_#1e293b]">
            {meta}
          </span>
        )}
      </div>
      <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl bg-[#EEF2FF] p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] dark:bg-slate-900 dark:shadow-[inset_5px_5px_10px_#020617,inset_-5px_-5px_10px_#1e293b] lg:min-h-[360px]">
        {children || <EmptyState text={emptyText ?? t("common.defaultEmptyResult")} iconLabel={resolvedTitle} />}
      </div>
      {downloadHref && (
        <div className="mt-4 rounded-3xl bg-white/60 p-3 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/60 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
          <a
            href={downloadHref}
            download={downloadName}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95"
          >
            {resolvedDownloadLabel}
          </a>
        </div>
      )}
    </section>
  );
}
