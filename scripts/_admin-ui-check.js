const fs = require("fs");
const crypto = require("crypto");

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      let v = l.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      return [l.slice(0, i).trim(), v];
    })
);

const b64u = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const payload = b64u(Buffer.from(JSON.stringify({ u: env.ADMIN_USERNAME, e: Date.now() + 8 * 3600 * 1000 })));
const sig = b64u(crypto.createHmac("sha256", env.SESSION_SECRET).update(payload).digest());
const cookie = `dortbucak_admin=${payload}.${sig}`;

const paths = ["/admin/giris", "/admin/paketler", "/admin/slider", "/admin/paketler/yeni", "/admin/slider/yeni"];

(async () => {
  for (const p of paths) {
    const headers = p === "/admin/giris" ? {} : { cookie };
    const r = await fetch("http://localhost:3000" + p, { headers, redirect: "manual" });
    const t = await r.text();
    const bad = /Application error|Build Error|Unhandled Runtime|__next_error__/i.test(t);
    const title = (t.match(/<title>[^<]+<\/title>/i) || [""])[0];
    console.log(
      JSON.stringify({
        p,
        status: r.status,
        len: t.length,
        bad,
        title,
        sidebar: t.includes("Yönetim menüsü"),
        hos: t.includes("Hoş geldiniz"),
        paket: t.includes("Yeni paket"),
        slider: t.includes("Yeni slider"),
        kaydet: t.includes("kaydet"),
      })
    );
    if (bad || r.status >= 400) {
      const i = t.search(/error|Error|Hata|digest/i);
      console.log(t.slice(Math.max(0, i - 80), i + 360).replace(/\s+/g, " ").slice(0, 420));
    }
    if (p === "/admin/paketler") {
      const id = (t.match(/\/admin\/paketler\/(\d+)/) || [])[1];
      if (id) paths.push(`/admin/paketler/${id}`);
      const css = (t.match(/href="([^"]+\.css)"/) || [])[1];
      if (css) {
        const c = await (await fetch("http://localhost:3000" + css)).text();
        console.log(JSON.stringify({ css: true, yonetim: c.includes(".yonetim-alan"), birincil: c.includes(".yonetim-birincil") }));
      }
    }
    if (p === "/admin/slider") {
      const id = (t.match(/\/admin\/slider\/(\d+)/) || [])[1];
      if (id) paths.push(`/admin/slider/${id}`);
    }
  }
})().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
