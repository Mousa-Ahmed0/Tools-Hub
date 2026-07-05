import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/resize-for-instagram")!);

export default function ResizeForInstagramLayout({ children }: { children: ReactNode }) {
  return children;
}
