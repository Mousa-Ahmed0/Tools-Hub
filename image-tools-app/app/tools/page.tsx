"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ToolCategory, toolCategories, tools } from "@/lib/tools";

function getCategoryId(category: ToolCategory) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "All">(
    "All"
  );

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] sm:p-10">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff]">
            Tools Dashboard
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            All Image Tools
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Search, filter, and open fast browser-based tools for image, PDF,
            color, and utility workflows.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tools..."
              className="w-full rounded-2xl border-0 bg-[#EEF2FF] px-5 py-4 text-sm font-semibold text-slate-700 outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] placeholder:text-slate-400"
            />

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
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[6px_6px_14px_#c8d0df,-6px_-6px_14px_#ffffff]"
                      : "bg-[#EEF2FF] text-slate-600 shadow-[6px_6px_14px_#d1d9e6,-6px_-6px_14px_#ffffff] hover:text-indigo-600"
                  }`}
                >
                  {category}
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
                    <h2 className="text-2xl font-bold text-slate-900">
                      {category}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {categoryTools.length} available tools
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <article
                      key={tool.href}
                      className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]"
                    >
                      <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600">
                        {tool.category}
                      </span>
                      <h3 className="mt-4 text-xl font-bold text-slate-900">
                        {tool.name}
                      </h3>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                        {tool.description}
                      </p>

                      <div className="mt-5">
                        {tool.available ? (
                          <Link
                            href={tool.href}
                            className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-[5px_5px_12px_#c8d0df,-5px_-5px_12px_#ffffff] transition hover:opacity-95"
                          >
                            Open Tool
                          </Link>
                        ) : (
                          <span className="inline-flex rounded-2xl bg-white/70 px-5 py-3 text-sm font-bold text-slate-400">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {!filteredTools.length && (
          <div className="mt-10 rounded-3xl bg-[#EEF2FF] p-8 text-center text-slate-600 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
            No tools match your search.
          </div>
        )}
      </div>
    </section>
  );
}
