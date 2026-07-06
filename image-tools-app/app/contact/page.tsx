import Link from "next/link";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

const seo = getSeoByPath("/contact");

export const metadata = createSeoMetadata({
  title: seo?.title ?? "Contact | Image Tools Hub",
  description:
    seo?.description ??
    "Contact Image Tools Hub for support, bug reports, feature ideas, and product feedback.",
  path: "/contact",
});

const contactCards = [
  {
    title: "Support",
    body: "Need help using a tool or found something confusing? Send a clear note with the tool name and what happened.",
  },
  {
    title: "Bug reports",
    body: "Include the browser, file type, expected result, and actual result so the issue can be reproduced faster.",
  },
  {
    title: "Feature ideas",
    body: "Suggest new tools, workflow improvements, or polish that would make Image Tools Hub more useful.",
  },
];

export default function ContactPage() {
  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-10">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-950/70 dark:text-indigo-300 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
            Contact
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
            Questions, feedback, and product ideas are welcome.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Image Tools Hub is built around practical user workflows. If something
            is broken, unclear, or worth improving, send the details and the page
            or tool involved.
          </p>
          <div className="mt-8">
            <a
              href="mailto:support@image-tools-hub.com"
              className="inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5"
            >
              support@image-tools-hub.com
            </a>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]"
            >
              <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">
                {card.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-3xl bg-[#EEF2FF] p-6 text-sm leading-7 text-slate-600 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:text-slate-300 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
          Prefer browsing first? Visit the{" "}
          <Link href="/tools" className="font-bold text-indigo-600 dark:text-indigo-300">
            full tools directory
          </Link>
          {" "}to find the right workflow.
        </div>
      </div>
    </section>
  );
}
