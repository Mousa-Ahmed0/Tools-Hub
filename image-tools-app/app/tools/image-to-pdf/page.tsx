"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { imagesToPdf } from "@/lib/pdf/image-to-pdf";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previews = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    setFiles(selectedFiles);
    setPdfUrl("");
    setError("");
  }

  async function handleConvert() {
    if (!files.length) {
      setError("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const pdfBlob = await imagesToPdf(files);
      const objectUrl = URL.createObjectURL(pdfBlob);

      setPdfUrl(objectUrl);
    } catch {
      setError("Something went wrong while creating the PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Image to PDF
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload one or more images and convert them into a single PDF file.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-900">
              Upload Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />

            {files.length > 0 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                Selected images:{" "}
                <span className="font-semibold">{files.length}</span>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleConvert}
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Creating PDF..." : "Convert to PDF"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>

          {previews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Selected Images
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {previews.map((preview) => (
                  <div
                    key={preview.url}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full rounded-xl border border-gray-200"
                    />
                    <p className="mt-3 truncate text-sm text-gray-600">
                      {preview.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pdfUrl && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                PDF Ready
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Your PDF file has been created successfully.
              </p>

              <div className="mt-4">
                <a
                  href={pdfUrl}
                  download="images.pdf"
                  className="inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  Download PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}