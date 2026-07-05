import { ReactNode } from "react";
import { createSeoMetadata, getSeoByPath } from "@/lib/seo";

export const metadata = createSeoMetadata(getSeoByPath("/tools/passport-photo-maker")!);

export default function PassportPhotoMakerLayout({ children }: { children: ReactNode }) {
  return children;
}
