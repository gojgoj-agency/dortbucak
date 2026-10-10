import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const IZIN = /^uploads\/[a-z0-9-]+\.(webp|pdf)$/;

export async function GET(_req, { params }) {
  const pathname = (params.path || []).join("/");
  if (!IZIN.test(pathname)) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
