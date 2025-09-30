import { ImageResponse } from "next/og"

export const alt = "Promptories"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const iconUrl = new URL(
  "/white-icon.png",
  process.env.METADATA_BASE_URL,
).toString()

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #fdba74 0%, #ea580c 50%, #fdba74 100%)",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <img
              src={iconUrl}
              height={100}
              width={100}
              style={{ borderRadius: "0.5rem", height: 150, width: 150 }}
              alt="Promptories Icon"
            />
            <h1
              style={{
                color: "#fff7ed",
                fontSize: 80,
                fontWeight: "bolder",
                margin: 0,
              }}
            >
              Promptories
            </h1>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
