import { spawn } from "child_process";
import { readFileSync } from "fs";
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
const port = 9342;
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=" + path.join(os.tmpdir(), "dortbucak-ozel-check"),
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
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const msgId = ++id;
  pending.set(msgId, (msg) => (msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)));
  const payload = { id: msgId, method, params };
  if (sessionId) payload.sessionId = sessionId;
  ws.send(JSON.stringify(payload));
});
await new Promise((resolve, reject) => { ws.addEventListener("open", resolve); ws.addEventListener("error", reject); });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
async function go(url, width) {
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 800 }, sessionId);
  await send("Page.navigate", { url }, sessionId);
  await sleep(1400);
}
async function ev(expression) {
  const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (res.exceptionDetails) return { hata: res.exceptionDetails.text };
  return res.result?.value;
}
const user = JSON.stringify(env.ADMIN_USERNAME || "");
const pass = JSON.stringify(env.ADMIN_PASSWORD || "");
await go("http://localhost:3000/admin/giris", 1280);
await ev(`(async () => {
  const set = (el, v) => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  set(document.querySelector('[name=username]'), ${user});
  set(document.querySelector('[name=password]'), ${pass});
  document.querySelector("form").requestSubmit();
  const start = Date.now();
  while (Date.now() - start < 8000 && location.pathname.includes("giris")) await new Promise((r) => setTimeout(r, 300));
  return location.pathname;
})()`);
await go("http://localhost:3000/admin/kisiye-ozel", 1180);
const masa = await ev(`(() => {
  const vw = document.documentElement.clientWidth;
  const fields = [...document.querySelectorAll("label")].map((label) => {
    const span = label.querySelector(".yonetim-etiket");
    const field = label.querySelector("textarea, input, select");
    if (!span || !field) return null;
    const a = span.getBoundingClientRect();
    const b = field.getBoundingClientRect();
    const overlap = a.right > b.left + 1 && a.left < b.right - 1 && a.bottom > b.top + 1 && a.top < b.bottom - 1;
    return { overlap, stacked: a.bottom <= b.top + 4, right: b.right, w: b.width };
  }).filter(Boolean);
  return {
    h1: document.querySelector("h1")?.innerText,
    cards: document.querySelectorAll("article").length,
    err: document.body.innerText.includes("Application error"),
    overflow: document.documentElement.scrollWidth > vw + 2,
    bad: fields.filter((f) => f.overlap || !f.stacked || f.right > vw + 2 || f.w < 80).length,
    fields: fields.length,
  };
})()`);
await go("http://localhost:3000/admin/kisiye-ozel", 390);
const mobil = await ev(`(() => {
  const vw = document.documentElement.clientWidth;
  const nav = document.querySelector("header nav");
  return {
    overflow: document.documentElement.scrollWidth > vw + 2,
    navScroll: nav ? nav.scrollWidth > nav.clientWidth + 2 : false,
    h1: document.querySelector("h1")?.innerText,
  };
})()`);
await go("http://localhost:3000/kisiye-ozel-turlar", 1280);
const site = await ev(`({
  h1: document.querySelector("h1")?.innerText,
  kart: document.querySelectorAll("h3").length,
  metin: document.body.innerText.includes("Tarih ve süre") && document.body.innerText.includes("Konaklama"),
  err: document.body.innerText.includes("Application error"),
})`);
console.log(JSON.stringify({ masa, mobil, site }, null, 2));
ws.close();
chrome.kill();
