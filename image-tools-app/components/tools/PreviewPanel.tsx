import { ReactNode } from "react";

type PreviewPanelProps = {
  title: string;
  children?: ReactNode;
  emptyText?: string;
};

export default function PreviewPanel({
  title,
  children,
  emptyText = "Upload a file to preview it here.",
}: PreviewPanelProps) {
  return (
    <section className="rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-[#EEF2FF] p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
        {children || <p className="text-center text-sm text-slate-500">{emptyText}</p>}
      </div>
    </section>
  );
}
