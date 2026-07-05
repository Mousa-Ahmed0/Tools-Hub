import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/qr-code-generator")!);

export default function QrCodeGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
