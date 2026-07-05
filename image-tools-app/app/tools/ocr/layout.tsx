import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/ocr")!);

export default function OcrLayout({ children }: { children: ReactNode }) {
  return children;
}
