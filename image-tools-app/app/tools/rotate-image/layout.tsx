import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/rotate-image")!);

export default function RotateImageLayout({ children }: { children: ReactNode }) {
  return children;
}
