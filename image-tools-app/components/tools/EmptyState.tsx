"use client";

import { translateCommonLabel, useI18n } from "@/lib/i18n";

type EmptyStateProps = {
  text?: string;
  iconLabel?: string;
};

export default function EmptyState({
  text,
  iconLabel,
}: EmptyStateProps) {
  const { t } = useI18n();
  const resolvedIconLabel = iconLabel ?? t("common.preview");
  const resolvedText = translateCommonLabel(t, text) ?? text ?? t("common.defaultEmptyResult");

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EEF2FF] text-2xl font-black text-indigo-500 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:text-violet-300 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
        {resolvedIconLabel.slice(0, 1).toUpperCase()}
      </div>
      <p className="max-w-xs text-sm font-semibold text-slate-500 dark:text-slate-400">{resolvedText}</p>
    </div>
  );
}
