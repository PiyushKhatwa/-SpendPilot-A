import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SpendPilot AI spend audit dashboard preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#07110d",
          color: "#f1f8f4",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 30, color: "#45e39a", marginBottom: 24 }}>
          SpendPilot AI
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          AI Spend Audit Platform
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a6b7ad" }}>
          Find wasted AI subscription and API spend before renewal.
        </div>
      </div>
    ),
    size,
  );
}
