import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/color-palette")!);

export default function ColorPaletteLayout({ children }: { children: ReactNode }) {
  return children;
}
