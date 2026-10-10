import { site } from "@/lib/site";

// Arama motorları ve yanıt veren yapay zeka tarayıcıları herkese açık sayfaları
// okuyabilir. Yönetim ve API kapalıdır. Ayrıntılı konu haritası /llms.txt dosyasındadır.
const gizli = ["/admin", "/api"];

const ajanlar = [
  "*",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  "Gemini-Deep-Research",
  "Applebot",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "DeepSeekBot",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
  "PhindBot",
  "MistralAI-User",
];

export default function robots() {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: ajanlar.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: gizli,
    })),
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host,
  };
}
