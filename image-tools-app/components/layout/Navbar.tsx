"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Home,
  ImageIcon,
  Info,
  LayoutGrid,
  Mail,
  Palette,
  Settings2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import HeaderSearch from "./HeaderSearch";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { TranslationKey, useI18n } from "@/lib/i18n";

const navItems: { labelKey: TranslationKey; href: string; icon: LucideIcon }[] = [
  { labelKey: "common.home", href: "/", icon: Home },
  { labelKey: "common.allTools", href: "/tools", icon: LayoutGrid },
  { labelKey: "common.imageEditing", href: "/tools#image-editing", icon: ImageIcon },
  { labelKey: "common.pdfTools", href: "/tools#pdf-tools", icon: FileText },
  { labelKey: "common.colorTools", href: "/tools#color-tools", icon: Palette },
  { labelKey: "common.utilityTools", href: "/tools#utility-tools", icon: Settings2 },
  { labelKey: "common.aiTools", href: "/tools/ai", icon: Sparkles },
  { labelKey: "common.about", href: "/#about", icon: Info },
  { labelKey: "common.contact", href: "/#contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/tools") return pathname === "/tools";
    if (href === "/tools/ai") return pathname === "/tools/ai";
    return false;
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-[#EEF2FF]/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:px-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 md:flex-nowrap md:gap-4">
          <Link
            href="/"
            className="flex w-auto min-w-0 shrink-0 items-center gap-3 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg lg:w-60"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
              <ImageIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">{t("app.name")}</span>
          </Link>

          <HeaderSearch />

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <button
              type="button"
              title={t("common.user")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-black text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:-translate-y-0.5 hover:scale-105 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]"
            >
              M
            </button>
          </div>
        </div>
      </header>

      <aside className="app-sidebar fixed bottom-0 top-20 z-30 hidden w-72 bg-[#EEF2FF] p-6 transition-colors dark:bg-slate-950 lg:block">
        <nav className="space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/70 hover:text-indigo-600 hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:hover:bg-slate-900 dark:hover:text-violet-300 dark:hover:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b] ${
                isActive(item.href)
                  ? "bg-white/80 text-indigo-600 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-900 dark:text-violet-300 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]"
                  : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#EEF2FF] text-indigo-600 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] dark:bg-slate-900 dark:text-violet-300 dark:shadow-[4px_4px_10px_#020617,-4px_-4px_10px_#1e293b]">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 p-5 text-white shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
          <p className="text-sm font-semibold">{t("common.privateProcessing")}</p>
          <p className="mt-1 text-xs text-indigo-100">
            {t("common.privateProcessingBody")}
          </p>
        </div>
      </aside>
    </>
  );
}
