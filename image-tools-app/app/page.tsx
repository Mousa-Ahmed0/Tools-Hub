import Link from "next/link";
import { tools } from "@/lib/tools";

const stats = [
  "19+ Free Tools",
  "Fast Results",
  "Private Processing",
  "Easy to Use",
];

const popularTools = tools.filter((tool) => tool.popular).slice(0, 6);

export default function HomePage() {
  return (
    <div className="px-5 py-10 sm:py-14">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff]">
              Image Tools Hub
            </span>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Free Online Image Tools
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Edit, convert, compress, and enhance your images in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-[6px_6px_14px_#c8d0df,-6px_-6px_14px_#ffffff] transition hover:opacity-95"
              >
                Explore Tools
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-2xl bg-[#EEF2FF] px-6 py-3 text-sm font-bold text-slate-700 shadow-[6px_6px_14px_#d1d9e6,-6px_-6px_14px_#ffffff] transition hover:text-indigo-600"
              >
                How It Works
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat}
                className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
              >
                <p className="text-lg font-bold text-slate-900">{stat}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Built for quick, simple browser workflows.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto mt-12 max-w-6xl">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Choose a tool", "Pick the image workflow you need from the tools dashboard."],
            ["Process locally", "Most tools run in your browser with no complicated setup."],
            ["Download results", "Preview the output and save the finished file."],
          ].map(([title, copy]) => (
            <div
              key={title}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]"
            >
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Popular Tools
            </h2>
            <p className="mt-2 text-slate-600">
              Start with the most-used tools in the hub.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-bold text-indigo-600 transition hover:text-violet-600"
          >
            View all tools
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] transition hover:-translate-y-0.5 hover:text-indigo-600"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                {tool.category}
              </span>
              <h3 className="mt-3 text-xl font-bold text-slate-900">
                {tool.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
