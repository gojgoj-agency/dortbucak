import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { verifySessionValue, SESSION_COOKIE } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
const MAX = 10 * 1024 * 1024; // 10 MB

export async function POST(req) {
  const session = await verifySessionValue(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Dosya depolama ayarı eksik." }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Dosya 10 MB'den büyük olamaz." }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const base = slugify(path.parse(file.name).name).slice(0, 40) || "dosya";
  const stamp = Date.now().toString(36);

  const isImage = /^image\/(jpeg|png|webp|avif|gif)$/.test(file.type);
  const isPdf = file.type === "application/pdf";
  if (!isImage && !isPdf) {
    return NextResponse.json({ error: "Yalnızca görsel (JPG, PNG, WebP) veya PDF yüklenebilir." }, { status: 400 });
  }

  let name;
  let body;
  let contentType;
  if (isImage) {
    name = `${base}-${stamp}.webp`;
    body = await sharp(buf).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    contentType = "image/webp";
  } else {
    name = `${base}-${stamp}.pdf`;
    body = buf;
    contentType = "application/pdf";
  }

  try {
    const blob = await put(`uploads/${name}`, body, {
      access: "private",
      contentType,
    });
    return NextResponse.json({ url: `/api/dosya/${blob.pathname}` });
  } catch (err) {
    console.error("Blob yükleme hatası:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Dosya yüklenemedi." }, { status: 500 });
  }
}
