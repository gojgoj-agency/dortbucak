import { spawn } from "child_process";
import { WebSocket } from "undici";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9334;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--user-data-dir=scripts/_chrome-wa",
    "--no-first-run",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" }
);

async function json(path) {
  const r = await fetch(`http://127.0.0.1:${port}${path}`);
  return r.json();
}

let version;
for (let i = 0; i < 40; i++) {
  try {
    version = await json("/json/version");
    break;
  } catch {
    await sleep(200);
  }
}
if (!version) {
  chrome.kill();
  throw new Error("chrome acilmadi");
}

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

async function evalExpr(expression) {
  const res = await send("Runtime.evaluate", { expression, returnByValue: true });
  return res.result?.result?.value;
}

async function check(name, width, height, mobile, url) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await send("Page.navigate", { url });
  await sleep(1200);
  const info = await evalExpr(`(() => {
    const a = document.querySelector('a[aria-label="WhatsApp ile yazın"]');
    if (!a) return { yok: true, path: location.pathname };
    const r = a.getBoundingClientRect();
    const s = getComputedStyle(a);
    return {
      href: a.href,
      target: a.target,
      bottom: Math.round(height - r.bottom),
      right: Math.round(width - r.right),
      w: Math.round(r.width),
      h: Math.round(r.height),
      position: s.position,
      z: s.zIndex,
      bg: s.backgroundColor,
    };
  })()`.replace("height", String(height)).replace("width", String(width)));
  console.log(name, JSON.stringify(info));
}

await send("Page.enable");
await send("Target.setDiscoverTargets", { discover: true });

await check("desktop-home", 1440, 900, false, "http://localhost:3000/");
await check("mobile-home", 390, 844, true, "http://localhost:3000/");
await check("mobile-paket", 390, 844, true, "http://localhost:3000/paket/ekim-kasim-umresi");
await check("desktop-paket", 1440, 900, false, "http://localhost:3000/paket/ekim-kasim-umresi");

const before = (await json("/json/list")).map((t) => t.url);
await evalExpr(`document.querySelector('a[aria-label="WhatsApp ile yazın"]').click()`);
await sleep(1500);
const after = (await json("/json/list")).map((t) => t.url);
console.log("tabs-before", before);
console.log("tabs-after", after);

ws.close();
chrome.kill();
process.exit(0);
