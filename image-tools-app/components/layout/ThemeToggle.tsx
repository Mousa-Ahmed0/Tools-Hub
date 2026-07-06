"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: Theme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);
  }, []);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  }

  const label = theme === "dark" ? t("common.darkMode") : t("common.lightMode");

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={label}
        title={label}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2FF] text-slate-700 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition duration-200 hover:-translate-y-0.5 hover:scale-105 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] dark:hover:text-violet-300"
      >
        {mounted && theme === "dark" ? (
          <Moon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Sun className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      <span className="pointer-events-none absolute end-0 top-full z-50 mt-2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
        {label}
      </span>
    </div>
  );
}
