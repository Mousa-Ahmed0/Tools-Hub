import { ReactNode } from "react";
import { createSeoMetadata, toolsSeo } from "@/lib/seo";

export const metadata = createSeoMetadata(toolsSeo);

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return children;
}
