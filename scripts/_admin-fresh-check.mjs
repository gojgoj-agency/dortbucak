const SECRET = process.env.SESSION_SECRET;
const enc = new TextEncoder();
const b64u = (bytes) => {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
const payload = b64u(enc.encode(JSON.stringify({ u: "dortbucak", e: Date.now() + 8 * 60 * 60 * 1000 })));
const sig = b64u(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payload))));
const cookie = "dortbucak_admin=" + payload + "." + sig;

for (const p of ["/admin/sss", "/admin/ilkelerimiz"]) {
  const res = await fetch("http://localhost:3000" + p, { headers: { cookie } });
  const html = await res.text();
  const questions = [...html.matchAll(/hover:text-altin\\?">([^<]+)/g)].map((m) => m[1]);
  const numbers = [...html.matchAll(/text-3xl leading-none text-cam\\?">([^<]+)/g)].map((m) => m[1]);
  const anchors = [...html.matchAll(/href="(\/admin\/(?:sss|ilkelerimiz))"/g)].map((m) => m[1]);
  console.log(p, res.status, "stats", numbers.join(","), "pasaport", html.includes("pasaport"), "hassasiyet", html.includes("Hassasiyet"), "menuAnchors", html.includes('href="/admin/sss"'));
}
