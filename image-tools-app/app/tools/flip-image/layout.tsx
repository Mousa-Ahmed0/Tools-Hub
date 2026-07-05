import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/flip-image")!);

export default function FlipImageLayout({ children }: { children: ReactNode }) {
  return children;
}
