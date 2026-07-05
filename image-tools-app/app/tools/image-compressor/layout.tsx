import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/image-compressor")!);

export default function ImageCompressorLayout({ children }: { children: ReactNode }) {
  return children;
}
