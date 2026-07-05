"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TranslationKey, useI18n } from "@/lib/i18n";
import { ToolCategory, toolCategories, tools } from "@/lib/tools";

function getCategoryId(category: ToolCategory) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

const categoryKeys: Record<ToolCategory, TranslationKey> = {
  "Image Editing": "common.imageEditing",
  "PDF Tools": "common.pdfTools",
  "Color Tools": "common.colorTools",
  "Utility Tools": "common.utilityTools",
};

export default function ToolsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "All">(
    "All"
  );

  useEffect(() => {
    function syncSearchFromUrl() {
      setSearch(new URLSearchParams(window.location.search).get("search") ?? "");
    }

    function syncSearchFromHeader(event: Event) {
      const customEvent = event as CustomEvent<{ query: string }>;
      setSearch(customEvent.detail.query);
    }

    syncSearchFromUrl();
    window.addEventListener("popstate", syncSearchFromUrl);
    window.addEventListener("tools-search", syncSearchFromHeader);

    return () => {
      window.removeEventListener("popstate", syncSearchFromUrl);
      window.removeEventListener("tools-search", syncSearchFromHeader);
    };
  }, []);

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const translatedName = t(`${tool.i18nKey}.name` as TranslationKey);
      const translatedDescription = t(`${tool.i18nKey}.description` as TranslationKey);
      const translatedCategory = t(categoryKeys[tool.category]);
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        translatedName.toLowerCase().includes(query) ||
        translatedDescription.toLowerCase().includes(query) ||
        translatedCategory.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, t]);

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-[#EEF2FF] dark:bg-slate-900 p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-10">
          <span className="inline-flex rounded-full bg-white/70 dark:bg-slate-950/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
            {t("tools.badge")}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            {t("tools.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            {t("tools.subtitle")}
          </p>

          <div className="mt-8 space-y-4">
            {search && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-slate-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff] dark:bg-slate-950/70 dark:text-slate-300 dark:shadow-[inset_3px_3px_7px_#020617,inset_-3px_-3px_7px_#1e293b]">
                <span>{t("tools.searchResults", { query: search })}</span>
                <Link href="/tools" onClick={() => setSearch("")} className="text-indigo-600 transition hover:text-violet-600">
                  {t("common.clear")}
                </Link>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {["All", ...toolCategories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category as ToolCategory | "All")
                  }
                  className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[6px_6px_14px_#c8d0df,-6px_-6px_14px_#ffffff] dark:shadow-[6px_6px_14px_#020617,-6px_-6px_14px_#1e293b]"
                      : "bg-[#EEF2FF] dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-[6px_6px_14px_#d1d9e6,-6px_-6px_14px_#ffffff] dark:shadow-[6px_6px_14px_#020617,-6px_-6px_14px_#1e293b] hover:text-indigo-600"
                  }`}
                >
                  {category === "All"
                    ? t("common.allTools")
                    : t(categoryKeys[category as ToolCategory])}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {toolCategories.map((category) => {
            const categoryTools = filteredTools.filter(
              (tool) => tool.category === category
            );

            if (!categoryTools.length) return null;

            return (
              <section key={category} id={getCategoryId(category)}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {t(categoryKeys[category])}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {t("common.availableTools", { count: categoryTools.length })}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => {
                    const toolName = t(`${tool.i18nKey}.name` as TranslationKey);
                    const toolDescription = t(`${tool.i18nKey}.description` as TranslationKey);

                    return (
                      <article
                        key={tool.href}
                        className="group rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] transition duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_20px_#c8d0df,-10px_-10px_20px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] dark:hover:shadow-[10px_10px_20px_#020617,-10px_-10px_20px_#1e293b]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-indigo-600 shadow-[5px_5px_12px_#d1d9e6,-5px_-5px_12px_#ffffff] transition group-hover:scale-105 dark:bg-slate-900 dark:text-violet-300 dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b]">
                            <tool.icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:bg-slate-950/70">
                            {t(categoryKeys[tool.category])}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                          {toolName}
                        </h3>
                        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {toolDescription}
                        </p>

                        <div className="mt-5">
                          {tool.available ? (
                            <Link
                              href={tool.href}
                              className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] dark:shadow-[5px_5px_12px_#020617,-5px_-5px_12px_#1e293b] transition hover:opacity-95"
                            >
                              {t("common.openTool")}
                            </Link>
                          ) : (
                            <span className="inline-flex rounded-2xl bg-white/70 dark:bg-slate-950/70 px-5 py-3 text-sm font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400">
                              {t("common.comingSoon")}
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {!filteredTools.length && (
          <div className="mt-10 rounded-3xl bg-[#EEF2FF] dark:bg-slate-900 p-8 text-center text-slate-600 dark:text-slate-400 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
            {t("common.noTools")}
          </div>
        )}
      </div>
    </section>
  );
}



