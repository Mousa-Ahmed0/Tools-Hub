import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/favicon-generator")!);

export default function FaviconGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
