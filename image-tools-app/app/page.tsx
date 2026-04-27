import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
          Fast. Simple. Browser-based.
        </span>

        <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Fast online tools for images and files
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Resize, compress, convert, and manage images directly in your browser
          without installing heavy software.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Explore Tools
          </Link>

          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            View MVP Tools
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Fast Processing</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Quick tools for common image and file tasks with a clean user
            experience.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">SEO-Friendly Tools</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Every tool is planned as a dedicated page to support long-term
            organic growth.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Built to Scale</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            The architecture is prepared for future backend processing, storage,
            and paid features.
          </p>
        </div>
      </div>
    </section>
  );
}