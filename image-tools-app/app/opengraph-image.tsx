import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/lib/seo";

export const alt = `${siteName} preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #eef2ff 0%, #f8faff 55%, #ddd6fe 100%)",
          color: "#0f172a",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(255,255,255,0.85)",
            borderRadius: 48,
            boxShadow: "24px 24px 48px rgba(148,163,184,0.38)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            padding: 64,
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 20,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 28,
                color: "white",
                display: "flex",
                fontSize: 42,
                fontWeight: 900,
                height: 86,
                justifyContent: "center",
                width: 86,
              }}
            >
              IH
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#4f46e5", fontSize: 28, fontWeight: 800 }}>
                Browser-first tools
              </div>
              <div style={{ color: "#64748b", fontSize: 24, fontWeight: 700 }}>
                Image, PDF, color, QR, OCR
              </div>
            </div>
          </div>

          <div style={{ fontSize: 76, fontWeight: 950, letterSpacing: -2, lineHeight: 1 }}>
            {siteName}
          </div>
          <div style={{ color: "#475569", fontSize: 34, fontWeight: 650, lineHeight: 1.35 }}>
            {siteDescription}
          </div>
        </div>
      </div>
    ),
    size
  );
}
