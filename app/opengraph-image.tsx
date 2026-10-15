import { ImageResponse } from "next/og";
import { company } from "@/lib/data/company";

export const runtime = "edge";
export const alt = `${company.name} — ICT Infrastructure & Cybersecurity`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #05070c 0%, #0a0d14 60%, #0e1a33 100%)",
        color: "#f3f5f8",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 22,
          letterSpacing: 4,
          color: "#9aa4b8",
        }}
      >
        <div style={{ width: 28, height: 2, background: "#2f62c6" }} />
        ICT INFRASTRUCTURE · CYBERSECURITY
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          Engineering the infrastructure behind a <span style={{ color: "#8fb4f2" }}>secure</span>{" "}
          digital future.
        </div>
        <div style={{ fontSize: 28, color: "#c5ccd9" }}>{company.name} · Addis Ababa, Ethiopia</div>
      </div>
    </div>,
    { ...size },
  );
}
