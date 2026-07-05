"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="px-5 pb-8 pt-12 lg:pl-72">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl bg-[#EEF2FF] p-6 text-sm text-slate-600 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:text-slate-400 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{t("app.name")}</p>
          <p className="mt-1">{t("footer.subtitle")}</p>
        </div>

        <nav className="flex flex-wrap gap-4 font-semibold">
          <Link href="/" className="transition hover:text-indigo-600">
            {t("common.home")}
          </Link>
          <Link href="/tools" className="transition hover:text-indigo-600">
            {t("common.allTools")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
