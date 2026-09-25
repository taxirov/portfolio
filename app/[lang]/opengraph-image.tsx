import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export const alt = profile.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(hasLocale(lang) ? lang : DEFAULT_LOCALE);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "linear-gradient(90deg, #f1f5f9, #e2e8f0)",
          color: "#1e293b",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>{profile.name}</div>
        <div style={{ fontSize: 44, color: "#64748b", marginTop: 16, textTransform: "uppercase" }}>
          {dict.profile.jobTitle}
        </div>
        <div style={{ fontSize: 32, color: "#6366f1", marginTop: 48 }}>saad.uz</div>
      </div>
    ),
    size,
  );
}
