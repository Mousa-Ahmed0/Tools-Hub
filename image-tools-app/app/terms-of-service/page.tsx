import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

const seo = getSeoByPath("/terms-of-service");

export const metadata = createSeoMetadata({
  title: seo?.title ?? "Terms of Service | Image Tools Hub",
  description:
    seo?.description ??
    "Read the terms that apply when using Image Tools Hub and its free online tools.",
  path: "/terms-of-service",
});

const sections = [
  {
    title: "Use of the service",
    body: "Image Tools Hub provides free browser-based tools for image, PDF, color, QR, OCR, metadata, and related workflows. You may use the tools only for lawful purposes.",
  },
  {
    title: "Your files and content",
    body: "You are responsible for the files you choose to process and for confirming that you have the right to use them. Do not process content that violates laws or rights.",
  },
  {
    title: "No professional advice",
    body: "The tools are provided for general utility. Output should be reviewed before use in legal, official, identity, professional, or high-stakes contexts.",
  },
  {
    title: "Availability and changes",
    body: "Tools may change, improve, or become unavailable as the product evolves. We aim for reliability, but uninterrupted access is not guaranteed.",
  },
  {
    title: "Disclaimer of warranties",
    body: "The service is provided as is and as available. To the fullest extent permitted by law, Image Tools Hub disclaims warranties of accuracy, fitness, and uninterrupted operation.",
  },
  {
    title: "Limitation of liability",
    body: "Image Tools Hub is not liable for indirect, incidental, special, consequential, or loss-of-data damages arising from use of the site or generated results.",
  },
];

export default function TermsOfServicePage() {
  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-10">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-950/70 dark:text-indigo-300 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
            Last updated: July 6, 2026
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            These terms apply when you access or use Image Tools Hub and its
            browser-first tools.
          </p>
        </header>

        <div className="space-y-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]"
            >
              <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <p className="rounded-3xl bg-[#EEF2FF] p-6 text-sm leading-7 text-slate-600 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:text-slate-300 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b]">
          Questions about these terms can be sent to support@image-tools-hub.com.
        </p>
      </div>
    </section>
  );
}
