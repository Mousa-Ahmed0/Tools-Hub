import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-5 pb-8 pt-12 lg:pl-72">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl bg-[#EEF2FF] p-6 text-sm text-slate-600 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900">Image Tools Hub</p>
          <p className="mt-1">Free browser-based tools for everyday image work.</p>
        </div>

        <nav className="flex flex-wrap gap-4 font-semibold">
          <Link href="/" className="transition hover:text-indigo-600">
            Home
          </Link>
          <Link href="/tools" className="transition hover:text-indigo-600">
            All Tools
          </Link>
        </nav>
      </div>
    </footer>
  );
}
