import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { WebSocket } from "undici";

const port = 9341;
const chrome = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=" + port,
    "--user-data-dir=c:\\Users\\samet.besikli\\Projeler\\dortbucak\\scripts\\_shots\\kart-chrome",
    "about:blank",
  ],
  { stdio: "ignore" }
);

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

let version;
for (let i = 0; i < 40; i++) {
  try {
    version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    break;
  } catch { await sleep(200); }
}
if (!version) throw new Error("chrome acilmadi");

const tab = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.webSocketDebuggerUrl);
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

await send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false,
});
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(2500);
await send("Runtime.evaluate", {
  expression: `(() => { const el = [...document.querySelectorAll("h2")].find((n) => n.textContent.includes("Umre Turları")); if (el) el.scrollIntoView({ block: "center" }); return !!el; })()`,
  returnByValue: true,
});
await sleep(800);
const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 });
const out = "c:\\Users\\samet.besikli\\Projeler\\dortbucak\\public\\images\\_kart-onizleme.jpg";
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log("shot", out);
ws.close();
chrome.kill();
