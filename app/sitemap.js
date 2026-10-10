import { getPackages } from "@/lib/db";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const statikSayfalar = [
  ["", "weekly", 1],
  ["/hac-turlari", "daily", 0.9],
  ["/umre-turlari", "daily", 0.9],
  ["/sss", "monthly", 0.6],
  ["/hakkimizda", "monthly", 0.5],
  ["/iletisim", "monthly", 0.5],
];

export default async function sitemap() {
  const base = site.url.replace(/\/$/, "");
  const bugun = new Date();
  const statik = statikSayfalar.map(([p, changeFrequency, priority]) => ({
    url: base + p,
    lastModified: bugun,
    changeFrequency,
    priority,
  }));
  const paketler = (await getPackages({})).map((p) => ({
    url: `${base}/paket/${p.slug}`,
    lastModified: bugun,
    changeFrequency: "weekly",
    priority: p.featured ? 0.8 : 0.7,
  }));
  return [...statik, ...paketler];
}
