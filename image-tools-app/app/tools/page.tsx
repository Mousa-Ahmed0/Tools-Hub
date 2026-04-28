import Link from "next/link";

const tools = [
  { name: "Image Resizer", href: "/tools/image-resizer" },
  { name: "Image Compressor", href: "#" },
  { name: "Image Converter", href: "/tools/image-converter" },
  { name: "Crop Image", href: "#" },
  { name: "Rotate Image", href: "#" },
  { name: "Flip Image", href: "#" },
  { name: "Image to PDF", href: "#" },
  { name: "PDF to Image", href: "#" },
  { name: "Resize for Instagram", href: "#" },
  { name: "QR Code Generator", href: "#" },
  { name: "Color Picker", href: "#" },
  { name: "Passport Photo Maker", href: "#" },
];

export default function ToolsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Tools</h1>

      <p className="mt-3 text-lg text-gray-600">
        MVP tools planned for the first release.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{tool.name}</h2>

            <p className="mt-2 text-sm text-gray-600">
              Coming soon in the MVP release.
            </p>

            <div className="mt-4">
              {tool.href === "#" ? (
                <span className="text-sm text-gray-400">Not available yet</span>
              ) : (
                <Link
                  href={tool.href}
                  className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                >
                  Open Tool
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}