import { ReactNode } from "react";

type ToolPageShellProps = {
  title: string;
  description: string;
  controls: ReactNode;
  children: ReactNode;
};

export default function ToolPageShell({
  title,
  description,
  controls,
  children,
}: ToolPageShellProps) {
  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#EEF2FF] p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] sm:p-8">
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-[inset_3px_3px_7px_#d1d9e6,inset_-3px_-3px_7px_#ffffff]">
            Image Tools Hub
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-6">{controls}</div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
