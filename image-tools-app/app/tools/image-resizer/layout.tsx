import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/image-resizer")!);

export default function ImageResizerLayout({ children }: { children: ReactNode }) {
  return children;
}
