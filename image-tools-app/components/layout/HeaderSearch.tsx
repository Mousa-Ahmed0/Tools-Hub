"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { direction, t } = useI18n();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    router.push(trimmedQuery ? `/tools?search=${encodeURIComponent(trimmedQuery)}` : "/tools");
    window.dispatchEvent(
      new CustomEvent("tools-search", { detail: { query: trimmedQuery } })
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative order-last w-full md:order-none md:mx-auto md:max-w-2xl">
      <Search
        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
          direction === "rtl" ? "right-4" : "left-4"
        }`}
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("common.searchTools")}
        className={`w-full rounded-3xl border border-slate-200/70 bg-[#F8FAFF] py-3 text-sm font-semibold text-slate-700 outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] placeholder:text-slate-400 transition focus:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[inset_5px_5px_10px_#020617,inset_-5px_-5px_10px_#1e293b] dark:placeholder:text-slate-500 ${
          direction === "rtl" ? "pl-4 pr-11 text-right" : "pl-11 pr-4 text-left"
        }`}
      />
    </form>
  );
}
