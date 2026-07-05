import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/image-watermark")!);

export default function ImageWatermarkLayout({ children }: { children: ReactNode }) {
  return children;
}
