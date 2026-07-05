import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/background-color-remover")!);

export default function BackgroundColorRemoverLayout({ children }: { children: ReactNode }) {
  return children;
}
