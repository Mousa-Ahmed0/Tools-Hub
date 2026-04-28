import Link from "next/link";

const tools = [
  { name: "Image Resizer", href: "/tools/image-resizer", available: true },
  { name: "Image Compressor", href: "/tools/image-compressor", available: true },
  { name: "Image Converter", href: "/tools/image-converter", available: true },
  { name: "Crop Image", href: "/tools/crop-image", available: true },
  { name: "Rotate Image", href: "/tools/rotate-image", available: true },
  { name: "Flip Image", href: "/tools/flip-image", available: true },
  { name: "Image to PDF", href: "/tools/image-to-pdf", available: true },
  { name: "PDF to Image", href: "/tools/pdf-to-image", available: true },
  { name: "Resize for Instagram", href: "#", available: false },
  { name: "QR Code Generator", href: "#", available: false },
  { name: "Color Picker", href: "#", available: false },
  { name: "Passport Photo Maker", href: "#", available: false },
];

export default function ToolsPage() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Tools
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            MVP tools planned for the first release.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {tool.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {tool.available
                  ? "This tool is available in the current MVP."
                  : "Coming soon in the MVP release."}
              </p>

              <div className="mt-5">
                {tool.available ? (
                  <Link
                    href={tool.href}
                    className="inline-flex rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    Open Tool
                  </Link>
                ) : (
                  <span className="inline-flex rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500">
                    Not available yet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}