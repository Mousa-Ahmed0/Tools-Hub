import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/crop-image")!);

export default function CropImageLayout({ children }: { children: ReactNode }) {
  return children;
}
