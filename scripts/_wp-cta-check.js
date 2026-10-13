import { spawn } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { WebSocket } from "undici";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9335;
mkdirSync("scripts/_shots", { recursive: true });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--user-data-dir=scripts/_chrome-wp-cta",
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

async function shoot(name) {
  const { result } = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 });
  writeFileSync(`scripts/_shots/${name}`, Buffer.from(result.data, "base64"));
  console.log("shot", name);
}

async function check(name, width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await send("Page.navigate", { url: "http://localhost:3000/" });
  await sleep(1800);
  const info = await evalExpr(`(() => {
    const a = [...document.querySelectorAll("a")].find((n) => n.textContent.includes("Size uygun umre turunu"));
    if (!a) return { yok: true };
    a.scrollIntoView({ block: "center" });
    const icon = a.querySelector("span[aria-hidden]");
    const r = a.getBoundingClientRect();
    const ir = icon ? icon.getBoundingClientRect() : null;
    return {
      href: a.href,
      target: a.target,
      title: a.title,
      text: a.innerText.replace(/\\s+/g, " ").trim(),
      w: Math.round(r.width),
      icon: ir ? { w: Math.round(ir.width), h: Math.round(ir.height), bg: getComputedStyle(icon).backgroundColor } : null,
    };
  })()`);
  await sleep(400);
  await shoot(name);
  console.log(name, JSON.stringify(info));
  return info;
}

await send("Page.enable");
const desktop = await check("wp-cta-desktop.jpg", 1440, 900, false);
const mobile = await check("wp-cta-mobile.jpg", 390, 844, true);

const before = (await json("/json/list")).map((t) => t.url);
await evalExpr(`(() => {
  const a = [...document.querySelectorAll("a")].find((n) => n.textContent.includes("Size uygun umre turunu"));
  a.click();
})()`);
await sleep(1500);
const after = (await json("/json/list")).map((t) => t.url);
console.log("tabs-before", JSON.stringify(before));
console.log("tabs-after", JSON.stringify(after));
console.log("ok", Boolean(desktop?.icon && mobile?.icon && String(desktop.href).includes("whatsapp")));

ws.close();
chrome.kill();
process.exit(0);
