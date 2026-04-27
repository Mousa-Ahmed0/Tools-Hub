import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Image Tools Hub
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <Link href="/tools" className="transition hover:text-black">
            Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}