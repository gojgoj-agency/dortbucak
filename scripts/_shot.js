import { writeFileSync, mkdirSync } from "fs";
import { WebSocket } from "undici";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const dir = "scripts/_shots";
mkdirSync(dir, { recursive: true });

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function json(path) {
  const r = await fetch(`http://127.0.0.1:9333${path}`);
  return r.json();
}

let version;
for (let i = 0; i < 30; i++) {
  try { version = await json("/json/version"); break; } catch { await sleep(200); }
}
if (!version) throw new Error("chrome debug port acilmadi");

const tab = (await json("/json/list")).find((t) => t.webSocketDebuggerUrl);
const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

function send(method, params = {}) {
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((resolve) => pending.set(msgId, resolve));
}

async function shoot(name) {
  const { result } = await send("Page.captureScreenshot", { format: "jpeg", quality: 60 });
  writeFileSync(`${dir}/${name}`, Buffer.from(result.data, "base64"));
  console.log("shot", name);
}

await send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
});
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(2500);
await shoot("v-hero.jpg");

async function scrollToText(text) {
  const expr = `(() => {
    const el = [...document.querySelectorAll("p,h2,h1,a")].find((n) => n.textContent.includes(${JSON.stringify(text)}));
    if (!el) return "yok";
    el.scrollIntoView({ block: "center" });
    return el.textContent.slice(0, 80);
  })()`;
  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
  console.log("scroll", text, res.result?.result?.value);
  await sleep(400);
}

await scrollToText("Maneviyatla dolu yolculuklar");
await shoot("v-serit.jpg");
await scrollToText("Her Detayda Özen");
await shoot("v-slogan.jpg");
await scrollToText("Kültür Turları");
await shoot("v-kartlar.jpg");

await send("Emulation.setDeviceMetricsOverride", {
  width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
});
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(2000);
await shoot("v-mobil-hero.jpg");
await scrollToText("Maneviyatla dolu yolculuklar");
await shoot("v-mobil-serit.jpg");

await send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
});
await send("Page.navigate", { url: "http://localhost:3000/kultur-turlari" });
await sleep(2000);
await shoot("v-kultur-kapak.jpg");
await scrollToText("Tarihi Keşif");
await shoot("v-kultur-baslik.jpg");

ws.close();
