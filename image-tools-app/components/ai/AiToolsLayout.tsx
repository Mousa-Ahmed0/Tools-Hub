"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { TranslationKey, useI18n } from "@/lib/i18n";
import { tools } from "@/lib/tools";

const aiTools = tools.filter((tool) => tool.category === "AI Tools");

const notes: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  {
    titleKey: "aiTools.browserFirstTitle",
    bodyKey: "aiTools.browserFirstBody",
  },
  {
    titleKey: "aiTools.noPaidApisTitle",
    bodyKey: "aiTools.noPaidApisBody",
  },
  {
    titleKey: "aiTools.futureReadyTitle",
    bodyKey: "aiTools.futureReadyBody",
  },
];

function getAnchorId(href: string) {
  return href.split("#")[1] ?? href.replace(/\W+/g, "-");
}

export default function AiToolsLayout() {
  const { t } = useI18n();

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-[#F8FAFF] p-6 shadow-[10px_10px_24px_#d1d9e6,-10px_-10px_24px_#ffffff] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[10px_10px_24px_#020617,-10px_-10px_24px_#1e293b] sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-violet-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t("aiTools.badge")}
          </span>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-slate-100 sm:text-6xl">
                {t("aiTools.title")}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                {t("aiTools.subtitle")}
              </p>
            </div>

            <div className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[inset_8px_8px_18px_#d1d9e6,inset_-8px_-8px_18px_#ffffff] dark:bg-slate-950 dark:shadow-[inset_8px_8px_18px_#020617,inset_-8px_-8px_18px_#1e293b]">
              <div className="rounded-3xl bg-white/75 p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                      {t("common.privateProcessing")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {t("common.privateProcessingBody")}
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-700 dark:bg-violet-400/15 dark:text-violet-300">
                    {t("common.planned")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note.titleKey}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]"
            >
              <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">
                {t(note.titleKey)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t(note.bodyKey)}
              </p>
            </article>
          ))}
        </div>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {t("aiTools.plannedTools")}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {t("common.plannedToolsCount", { count: aiTools.length })}
              </p>
            </div>
            <Link
              href="/tools"
              className="text-sm font-bold text-indigo-600 transition hover:text-violet-600 dark:text-violet-300"
            >
              {t("common.allTools")}
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {aiTools.map((tool) => {
              const toolName = t(`${tool.i18nKey}.name` as TranslationKey);
              const toolDescription = t(`${tool.i18nKey}.description` as TranslationKey);

              return (
                <article
                  key={tool.href}
                  id={getAnchorId(tool.href)}
                  className="group rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] transition duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_20px_#c8d0df,-10px_-10px_20px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] dark:hover:shadow-[10px_10px_20px_#020617,-10px_-10px_20px_#1e293b]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-indigo-600 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition group-hover:scale-105 dark:bg-slate-900 dark:text-violet-300 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                      <tool.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:bg-slate-950/70 dark:text-violet-300">
                      {t("common.aiTools")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-slate-100">
                    {toolName}
                  </h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {toolDescription}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 px-5 py-3 text-sm font-bold text-slate-500 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-950/70 dark:text-slate-400 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
                    {t("aiTools.placeholderCta")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
