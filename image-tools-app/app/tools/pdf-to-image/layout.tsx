import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/pdf-to-image")!);

export default function PdfToImageLayout({ children }: { children: ReactNode }) {
  return children;
}
