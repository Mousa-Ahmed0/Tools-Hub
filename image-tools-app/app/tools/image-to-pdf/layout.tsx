import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/image-to-pdf")!);

export default function ImageToPdfLayout({ children }: { children: ReactNode }) {
  return children;
}
