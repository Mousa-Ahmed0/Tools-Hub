import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Image Editing", href: "/tools#image-editing" },
  { label: "PDF Tools", href: "/tools#pdf-tools" },
  { label: "Color Tools", href: "/tools#color-tools" },
  { label: "Utility Tools", href: "/tools#utility-tools" },
];

export default function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/60 bg-[#EEF2FF]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            Image Tools Hub
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <Link href="/" className="transition hover:text-indigo-600">Home</Link>
            <Link href="/tools" className="transition hover:text-indigo-600">Tools</Link>
          </nav>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 bg-[#EEF2FF] p-6 lg:block">
        <Link
          href="/"
          className="block rounded-3xl bg-[#EEF2FF] p-5 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]"
        >
          <span className="block text-xl font-bold tracking-tight text-slate-900">
            Image Tools Hub
          </span>
          <span className="mt-1 block text-sm text-slate-500">
            Browser-first image tools
          </span>
        </Link>

        <nav className="mt-8 space-y-3 text-sm font-semibold text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 transition hover:bg-white/70 hover:text-indigo-600 hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 p-5 text-white shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
          <p className="text-sm font-semibold">Private Processing</p>
          <p className="mt-1 text-xs text-indigo-100">
            Most tools run directly in your browser.
          </p>
        </div>
      </aside>
    </>
  );
}
