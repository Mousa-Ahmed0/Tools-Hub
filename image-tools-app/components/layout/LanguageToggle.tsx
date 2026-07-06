"use client";

import { Globe2 } from "lucide-react";
import { getLocaleLabel, useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, toggleLocale, t } = useI18n();
  const nextLocale = locale === "ar" ? "en" : "ar";
  const label = `${t("common.language")}: ${getLocaleLabel(nextLocale)}`;

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        onClick={toggleLocale}
        aria-label={label}
        title={label}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2FF] text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition duration-200 hover:-translate-y-0.5 hover:scale-105 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] dark:hover:text-violet-300"
      >
        <Globe2 className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </button>
      <span className="pointer-events-none absolute end-0 top-full z-50 mt-2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
        {getLocaleLabel(nextLocale)}
      </span>
    </div>
  );
}
