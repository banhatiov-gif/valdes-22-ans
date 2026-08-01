import { ImageResponse } from "next/og";

export const alt = "Valdes Banhatio — Bientôt 22 ans — Lundi 3 août";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background:
            "radial-gradient(circle at 50% 38%, #432b57 0%, #2d1b3d 45%, #180e22 100%)",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 460,
            fontWeight: 800,
            color: "#f0b429",
            opacity: 0.16,
            letterSpacing: -10,
          }}
        >
          22
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: 999,
              border: "1px solid rgba(253,246,227,0.25)",
              background: "rgba(253,246,227,0.06)",
              color: "#f0b429",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Lundi 3 août
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 800,
              color: "#fdf6e3",
              letterSpacing: -2,
            }}
          >
            Valdes Banhatio
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 36,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#f0b429",
            }}
          >
            Bientôt 22 ans
          </div>
        </div>
      </div>
    ),
    size
  );
}
