// Oturum: HMAC ile imzalanmış çerez. Web Crypto kullanılır (middleware/edge uyumlu).
const SECRET = process.env.SESSION_SECRET || "gelistirme-anahtari-degistirin";
const COOKIE = "dortbucak_admin";
const MAX_AGE = 60 * 60 * 8; // 8 saat

const enc = new TextEncoder();
const b64u = (bytes) => {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64u = (str) => {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "=".repeat((4 - (s.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function hmac(data) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64u(new Uint8Array(sig));
}

export async function createSessionValue(username) {
  const payload = b64u(enc.encode(JSON.stringify({ u: username, e: Date.now() + MAX_AGE * 1000 })));
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionValue(value) {
  if (!value || !value.includes(".")) return null;
  const [payload, sig] = value.split(".");
  if ((await hmac(payload)) !== sig) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64u(payload)));
    if (data.e < Date.now()) return null;
    return data;
  } catch { return null; }
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;
