import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#1a0f2c",
          backgroundImage: "linear-gradient(135deg, #1a0f2c 0%, #3d1c6d 45%, #6b2fd0 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#c9bde6" }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1, letterSpacing: -4 }}>
          <span>I design experiences.</span>
          <span>I engineer products.</span>
          <span style={{ fontWeight: 700, color: "#00e893" }}>I build technology</span>
          <span style={{ fontWeight: 700, color: "#00e893" }}>that makes an impact.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#00e893" }} />
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
