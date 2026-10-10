import { buildDoc } from "@/lib/llms";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const body = await buildDoc(params.doc || []);
  if (!body) {
    return new Response("Bulunamadı\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex, follow",
      Link: '</llms.txt>; rel="describedby"',
    },
  });
}
