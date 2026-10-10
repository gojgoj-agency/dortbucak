import { NextResponse } from "next/server";
import { verifySessionValue, SESSION_COOKIE } from "./lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/giris") {
    const session = await verifySessionValue(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/giris";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/admin"] };
