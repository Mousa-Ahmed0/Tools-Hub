import Link from "next/link";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

const seo = getSeoByPath("/about");

export const metadata = createSeoMetadata({
  title: seo?.title ?? "About | Image Tools Hub",
  description:
    seo?.description ??
    "Learn about Image Tools Hub, a browser-first collection of free image, PDF, color, and utility tools.",
  path: "/about",
});

const principles = [
  {
    title: "Browser-first tools",
    body: "Image Tools Hub focuses on fast workflows that run directly in the browser whenever possible.",
  },
  {
    title: "Private by design",
    body: "Most tools process files locally, helping users complete everyday tasks without unnecessary uploads.",
  },
  {
    title: "Built for practical work",
    body: "The product is shaped around common image, PDF, color, QR, OCR, and metadata tasks.",
  },
  {
    title: "Ready to grow",
    body: "The MVP stays simple today while keeping the architecture ready for future backend-powered features.",
  },
];

export default function AboutPage() {
  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-10">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-950/70 dark:text-indigo-300 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
            About the project
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
            Free online tools for everyday image work.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Image Tools Hub is a growing collection of browser-first tools for editing,
            converting, compressing, resizing, and inspecting images and related files.
            The goal is simple: make useful tools quick to find, pleasant to use, and
            available without installing extra software.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5"
            >
              Explore tools
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-[#EEF2FF] px-6 py-3 text-sm font-bold text-slate-700 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] transition hover:-translate-y-0.5 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[6px_6px_12px_#020617,-6px_-6px_12px_#1e293b]"
            >
              Share feedback
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]"
            >
              <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">
                {principle.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
