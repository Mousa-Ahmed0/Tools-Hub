"use client";

import Link from "next/link";
import { Crop, ImageIcon, RotateCw, SlidersHorizontal, Sparkles } from "lucide-react";
import { TranslationKey, useI18n } from "@/lib/i18n";
import { ToolCategory, tools } from "@/lib/tools";

const stats: TranslationKey[] = [
  "home.statTools",
  "home.statFast",
  "home.statPrivate",
  "home.statEasy",
];

const featuredToolNames = [
  "Image Resizer",
  "Image Compressor",
  "Image Converter",
  "Crop Image",
];

const categoryKeys: Record<ToolCategory, TranslationKey> = {
  "Image Editing": "common.imageEditing",
  "PDF Tools": "common.pdfTools",
  "Color Tools": "common.colorTools",
  "Utility Tools": "common.utilityTools",
  "AI Tools": "common.aiTools",
};

const popularTools = tools.filter((tool) => featuredToolNames.includes(tool.name));
const aiPreviewTools = tools.filter((tool) => tool.category === "AI Tools").slice(0, 3);

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="px-5 py-10 sm:py-14">
      <section className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-[#F8FAFF] p-6 shadow-[10px_10px_24px_#d1d9e6,-10px_-10px_24px_#ffffff] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[10px_10px_24px_#020617,-10px_-10px_24px_#1e293b] sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t("home.badge")}
              </span>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 dark:text-slate-100 sm:text-6xl lg:text-7xl">
                {t("home.titleLine1")}
                <span className="mt-2 block bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  {t("home.titleLine2")}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                {t("home.subtitle")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-4 text-sm font-bold text-white shadow-[6px_6px_14px_#c8d0df,-6px_-6px_14px_#ffffff] transition hover:-translate-y-0.5 hover:opacity-95 dark:shadow-[6px_6px_14px_#020617,-6px_-6px_14px_#1e293b]"
                >
                  {t("home.exploreTools")}
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#EEF2FF] px-7 py-4 text-sm font-bold text-slate-700 shadow-[6px_6px_14px_#d1d9e6,-6px_-6px_14px_#ffffff] transition hover:-translate-y-0.5 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[6px_6px_14px_#020617,-6px_-6px_14px_#1e293b] dark:hover:text-violet-300"
                >
                  {t("home.howItWorks")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[360px] rounded-3xl bg-[#EEF2FF] p-5 shadow-[inset_8px_8px_18px_#d1d9e6,inset_-8px_-8px_18px_#ffffff] dark:bg-slate-950 dark:shadow-[inset_8px_8px_18px_#020617,inset_-8px_-8px_18px_#1e293b]">
              <div className="rounded-3xl bg-white/75 p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t("home.workspaceTitle")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {t("home.workspaceSubtitle")}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    {t("home.ready")}
                  </span>
                </div>

                <div className="mt-5 aspect-[4/3] rounded-3xl bg-gradient-to-br from-indigo-100 via-white to-violet-100 p-4 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950">
                  <div className="grid h-full grid-cols-[0.7fr_1fr] gap-4">
                    <div className="space-y-3">
                      <div className="h-16 rounded-2xl bg-white/85 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] dark:bg-slate-900 dark:shadow-[4px_4px_10px_#020617,-4px_-4px_10px_#1e293b]" />
                      <div className="h-16 rounded-2xl bg-indigo-500/20 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] dark:bg-violet-400/15 dark:shadow-[4px_4px_10px_#020617,-4px_-4px_10px_#1e293b]" />
                      <div className="h-16 rounded-2xl bg-white/85 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] dark:bg-slate-900 dark:shadow-[4px_4px_10px_#020617,-4px_-4px_10px_#1e293b]" />
                    </div>
                    <div className="flex items-center justify-center rounded-3xl bg-white/90 shadow-[inset_5px_5px_12px_#d1d9e6,inset_-5px_-5px_12px_#ffffff] dark:bg-slate-900 dark:shadow-[inset_5px_5px_12px_#020617,inset_-5px_-5px_12px_#1e293b]">
                      <ImageIcon className="h-20 w-20 text-indigo-500 dark:text-violet-300" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 left-7 rounded-2xl bg-white px-4 py-3 shadow-[7px_7px_16px_#c8d0df,-7px_-7px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[7px_7px_16px_#020617,-7px_-7px_16px_#1e293b]">
                <Crop className="h-5 w-5 text-indigo-600 dark:text-violet-300" aria-hidden="true" />
              </div>
              <div className="absolute right-8 top-10 rounded-2xl bg-white px-4 py-3 shadow-[7px_7px_16px_#c8d0df,-7px_-7px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[7px_7px_16px_#020617,-7px_-7px_16px_#1e293b]">
                <RotateCw className="h-5 w-5 text-indigo-600 dark:text-violet-300" aria-hidden="true" />
              </div>
              <div className="absolute bottom-16 right-3 rounded-2xl bg-white px-4 py-3 shadow-[7px_7px_16px_#c8d0df,-7px_-7px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[7px_7px_16px_#020617,-7px_-7px_16px_#1e293b]">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600 dark:text-violet-300" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((statKey) => (
              <div
                key={statKey}
                className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] dark:bg-slate-950/70 dark:shadow-[inset_5px_5px_10px_#020617,inset_-5px_-5px_10px_#1e293b]"
              >
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{t(statKey)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {t("home.statBody")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("home.popularTitle")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {t("home.popularSubtitle")}
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-bold text-indigo-600 transition hover:text-violet-600 dark:text-violet-300"
          >
            {t("home.viewAll")}
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {popularTools.map((tool) => {
            const toolName = t(`${tool.i18nKey}.name` as TranslationKey);
            const toolDescription = t(`${tool.i18nKey}.description` as TranslationKey);

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] transition duration-200 hover:-translate-y-1 hover:text-indigo-600 hover:shadow-[10px_10px_20px_#c8d0df,-10px_-10px_20px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] dark:hover:shadow-[10px_10px_20px_#020617,-10px_-10px_20px_#1e293b]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-indigo-600 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition group-hover:scale-105 dark:bg-slate-900 dark:text-violet-300 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                    <tool.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:bg-slate-950/70 dark:text-violet-300">
                    {t(categoryKeys[tool.category])}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {toolName}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {toolDescription}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto mt-14 max-w-6xl">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["home.stepChooseTitle", "home.stepChooseBody"],
            ["home.stepProcessTitle", "home.stepProcessBody"],
            ["home.stepDownloadTitle", "home.stepDownloadBody"],
          ].map(([titleKey, copyKey]) => (
            <div
              key={titleKey}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t(titleKey as TranslationKey)}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(copyKey as TranslationKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
              {t("common.aiTools")}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("home.aiTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t("home.aiSubtitle")}
            </p>
          </div>
          <Link
            href="/tools/ai"
            className="text-sm font-bold text-indigo-600 transition hover:text-violet-600 dark:text-violet-300"
          >
            {t("home.viewAiTools")}
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {aiPreviewTools.map((tool) => {
            const toolName = t(`${tool.i18nKey}.name` as TranslationKey);
            const toolDescription = t(`${tool.i18nKey}.description` as TranslationKey);

            return (
              <Link
                key={tool.href}
                href="/tools/ai"
                className="group rounded-3xl bg-[#EEF2FF] p-5 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition hover:-translate-y-1 dark:bg-slate-950/70 dark:shadow-[inset_5px_5px_10px_#020617,inset_-5px_-5px_10px_#1e293b]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-indigo-600 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition group-hover:scale-105 dark:bg-slate-900 dark:text-violet-300 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                  <tool.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {toolName}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {toolDescription}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="about" className="mx-auto mt-14 max-w-6xl rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("home.aboutTitle")}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {t("home.aboutBody")}
        </p>
      </section>

      <section id="contact" className="mx-auto mt-6 max-w-6xl rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("home.contactTitle")}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {t("home.contactBody")}
        </p>
      </section>
    </div>
  );
}
