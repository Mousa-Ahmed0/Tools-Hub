import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

const seo = getSeoByPath("/privacy-policy");

export const metadata = createSeoMetadata({
  title: seo?.title ?? "Privacy Policy | Image Tools Hub",
  description:
    seo?.description ??
    "Read the Image Tools Hub privacy policy for browser-first processing, local preferences, and data handling.",
  path: "/privacy-policy",
});

const sections = [
  {
    title: "Browser-first processing",
    body: "Image Tools Hub is designed so supported tools process files directly in your browser whenever possible. Files selected for browser-first tools are not intentionally uploaded to an Image Tools Hub backend.",
  },
  {
    title: "Information you provide",
    body: "If you contact us by email, we may receive your email address, message content, and any details you choose to include so we can respond.",
  },
  {
    title: "Local preferences",
    body: "The app may store preferences such as theme and language in localStorage on your device. These preferences help keep the interface consistent between visits.",
  },
  {
    title: "Third-party services",
    body: "Some tools use open-source browser libraries for tasks such as QR code generation, OCR, PDF rendering, or image processing. These libraries run as part of the app experience.",
  },
  {
    title: "Data retention",
    body: "Files processed locally remain under your control in the browser session. Contact emails may be kept as long as needed to respond, resolve issues, and improve the product.",
  },
  {
    title: "Your choices",
    body: "You can clear browser storage, avoid submitting contact messages, or stop using the site at any time. You are responsible for deciding which files to process.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl bg-[#EEF2FF] p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:bg-slate-900 dark:shadow-[8px_8px_16px_#020617,-8px_-8px_16px_#1e293b] sm:p-10">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-indigo-600 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] dark:bg-slate-950/70 dark:text-indigo-300 dark:shadow-[inset_4px_4px_8px_#020617,inset_-4px_-4px_8px_#1e293b]">
            Last updated: July 6, 2026
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            This policy explains how Image Tools Hub handles information for its
            browser-first image, PDF, color, and utility tools.
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
          For privacy questions, contact support@image-tools-hub.com.
        </p>
      </div>
    </section>
  );
}
