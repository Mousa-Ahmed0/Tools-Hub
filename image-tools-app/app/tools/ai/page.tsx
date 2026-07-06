import AiToolsLayout from "@/components/ai/AiToolsLayout";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

const seo = getSeoByPath("/tools/ai");

export const metadata = createSeoMetadata({
  title: seo?.title ?? "AI Tools | Image Tools Hub",
  description:
    seo?.description ??
    "Explore planned AI-assisted image tools for captions, alt text, descriptions, OCR summaries, and color suggestions.",
  path: "/tools/ai",
});

export default function AiToolsPage() {
  return <AiToolsLayout />;
}
