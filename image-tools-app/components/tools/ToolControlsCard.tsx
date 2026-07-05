"use client";

import { ReactNode } from "react";
import { translateCommonLabel, useI18n } from "@/lib/i18n";

type ToolControlsCardProps = {
  children: ReactNode;
  error?: string;
};

export default function ToolControlsCard({
  children,
  error,
}: ToolControlsCardProps) {
  const { t } = useI18n();

  return (
    <aside className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t("common.controls")}</h2>
      <div className="mt-6 space-y-6">{children}</div>
      {error && (
        <p className="mt-5 text-sm font-semibold text-red-600">
          {translateCommonLabel(t, error) ?? error}
        </p>
      )}
    </aside>
  );
}
