import { ImageResponse } from "next/og";

export const alt = "Soma — A home for work made by people.";

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
          background: "#faf8f2",
          color: "#26342e",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#28473e",
            bottom: 0,
            display: "flex",
            height: 220,
            position: "absolute",
            right: 0,
            width: 430,
          }}
        />
        <div
          style={{
            border: "2px solid #d4a373",
            display: "flex",
            height: 180,
            left: 85,
            position: "absolute",
            top: 76,
            transform: "rotate(-6deg)",
            width: 145,
          }}
        />
        <div
          style={{
            border: "2px solid #28473e",
            display: "flex",
            height: 236,
            position: "absolute",
            right: 118,
            top: 60,
            transform: "rotate(8deg)",
            width: 186,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 100px",
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#28473e",
              display: "flex",
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            Soma
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "serif",
              fontSize: 82,
              letterSpacing: -4,
              lineHeight: 1.04,
              marginTop: 28,
              maxWidth: 760,
            }}
          >
            A home for work made by people.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
