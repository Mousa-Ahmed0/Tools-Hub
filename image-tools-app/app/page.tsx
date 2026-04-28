import Link from "next/link";

export default function HomePage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
            Image Tools Hub MVP
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Fast online tools for images and files
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Resize, compress, convert, and manage images directly in your browser.
            Start with a clean MVP foundation and expand into a full image tools platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore Tools
            </Link>

            <Link
              href="/tools/image-resizer"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Open Image Resizer
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Browser-based</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Process images directly in the browser with a fast and simple workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Scalable foundation</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Built as an MVP now, but structured to support backend growth later.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">SEO-ready growth</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Each tool can become its own landing page to support long-term organic traffic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}