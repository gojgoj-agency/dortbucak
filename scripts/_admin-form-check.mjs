import { spawn } from "child_process";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { WebSocket } from "undici";
import os from "os";
import path from "path";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
    })
);

const port = 9341;
const dir = "scripts/_shots";
mkdirSync(dir, { recursive: true });
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=" + path.join(os.tmpdir(), "dortbucak-admin-form"),
  "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let version;
for (let i = 0; i < 40; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (r.ok) { version = await r.json(); break; }
  } catch {}
  await sleep(200);
}
if (!version) { chrome.kill(); throw new Error("chrome acilmadi"); }

const ws = new WebSocket(version.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const msgId = ++id;
  pending.set(msgId, (msg) => (msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)));
  const payload = { id: msgId, method, params };
  if (sessionId) payload.sessionId = sessionId;
  ws.send(JSON.stringify(payload));
});
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve);
  ws.addEventListener("error", reject);
});
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);

async function go(url, width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: width < 800,
  }, sessionId);
  await send("Page.navigate", { url }, sessionId);
  await sleep(1600);
}

async function evalJson(expression) {
  const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
  return res.result?.value;
}

async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 55 }, sessionId);
  writeFileSync(`${dir}/${name}`, Buffer.from(data, "base64"));
}

const user = JSON.stringify(env.ADMIN_USERNAME || "");
const pass = JSON.stringify(env.ADMIN_PASSWORD || "");
await go("http://localhost:3000/admin/giris", 1280, 900);
const login = await evalJson(`(async () => {
  const u = document.querySelector('[name=username]');
  const p = document.querySelector('[name=password]');
  if (!u || !p) return { ok: false, href: location.href };
  const set = (el, v) => {
    const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    proto.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  set(u, ${user});
  set(p, ${pass});
  document.querySelector("form").requestSubmit();
  const start = Date.now();
  while (Date.now() - start < 8000) {
    await new Promise((r) => setTimeout(r, 300));
    if (!location.pathname.includes("giris")) break;
  }
  return {
    ok: !location.pathname.includes("giris"),
    path: location.pathname,
    alert: document.querySelector("[role=alert]")?.innerText || "",
    userLen: u.value.length,
    passLen: p.value.length,
  };
})()`);
await go("http://localhost:3000/admin/paketler", 1280, 900);
const href = await evalJson(`document.querySelector('article a[href^="/admin/paketler/"]')?.getAttribute("href") || ""`);
const pages = {};
for (const path of ["/admin/sss", "/admin/ilkelerimiz", href || "/admin/paketler"]) {
  await go("http://localhost:3000" + path, 1280, 900);
  pages[path] = await evalJson(`({ path: location.pathname, h1: document.querySelector("h1")?.innerText || "", err: document.body.innerText.includes("Application error") })`);
}

await go("http://localhost:3000" + (href || "/admin/paketler"), 1180, 1400);
const desktop = await evalJson(`(() => {
  const vw = document.documentElement.clientWidth;
  const fields = [...document.querySelectorAll("label")].map((label) => {
    const span = label.querySelector(".yonetim-etiket");
    const field = label.querySelector("input, textarea, select");
    if (!span || !field) return null;
    const a = span.getBoundingClientRect();
    const b = field.getBoundingClientRect();
    const overlap = a.right > b.left + 1 && a.left < b.right - 1 && a.bottom > b.top + 1 && a.top < b.bottom - 1;
    return {
      label: span.textContent.trim().slice(0, 40),
      overlap,
      stacked: a.bottom <= b.top + 4,
      fieldW: Math.round(b.width),
      right: Math.round(b.right),
    };
  }).filter(Boolean);
  const bad = fields.filter((f) => f.overlap || !f.stacked || f.fieldW < 120 || f.right > vw + 2);
  const pageOverflow = document.documentElement.scrollWidth > vw + 2;
  const alan = [...document.querySelectorAll(".yonetim-alan")].filter((el) => {
    const b = el.getBoundingClientRect();
    return b.width > 0 && (b.right > vw + 2 || b.width < 80);
  }).length;
  return { vw, pageOverflow, bad: bad.slice(0, 8), fieldCount: fields.length, alan, h1: document.querySelector("h1")?.innerText };
})()`);
await shot("admin-paket-masa.jpg");

await go("http://localhost:3000" + (href || "/admin/paketler"), 390, 900);
const mobile = await evalJson(`(() => {
  const vw = document.documentElement.clientWidth;
  const fields = [...document.querySelectorAll("label")].map((label) => {
    const span = label.querySelector(".yonetim-etiket");
    const field = label.querySelector("input, textarea, select");
    if (!span || !field) return null;
    const a = span.getBoundingClientRect();
    const b = field.getBoundingClientRect();
    const overlap = a.right > b.left + 1 && a.left < b.right - 1 && a.bottom > b.top + 1 && a.top < b.bottom - 1;
    return { label: span.textContent.trim().slice(0, 40), overlap, stacked: a.bottom <= b.top + 4, fieldW: Math.round(b.width), right: Math.round(b.right) };
  }).filter(Boolean);
  const bad = fields.filter((f) => f.overlap || !f.stacked || f.right > vw + 2);
  return { vw, pageOverflow: document.documentElement.scrollWidth > vw + 2, bad: bad.slice(0, 8), fieldCount: fields.length };
})()`);
await shot("admin-paket-mobil.jpg");

await go("http://localhost:3000/admin/sss", 390, 900);
const sss = await evalJson(`({ h1: document.querySelector("h1")?.innerText, cards: document.querySelectorAll("article").length, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2 })`);
await shot("admin-sss-mobil.jpg");

await go("http://localhost:3000/admin/paketler", 390, 900);
const liste = await evalJson(`({
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  cards: document.querySelectorAll("article").length,
})`);
console.log(JSON.stringify({ login, href, pages, desktop, mobile, sss, liste }, null, 2));
ws.close();
chrome.kill();
