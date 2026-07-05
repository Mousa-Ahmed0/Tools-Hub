type EmptyStateProps = {
  text?: string;
  iconLabel?: string;
};

export default function EmptyState({
  text = "Your result will appear here.",
  iconLabel = "Preview",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EEF2FF] text-2xl font-black text-indigo-500 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
        {iconLabel.slice(0, 1).toUpperCase()}
      </div>
      <p className="max-w-xs text-sm font-semibold text-slate-500">{text}</p>
    </div>
  );
}
