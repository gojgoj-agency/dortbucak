import { WebSocket } from "undici";

const port = 9334;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function json(path) {
  const r = await fetch(`http://127.0.0.1:${port}${path}`);
  return r.json();
}

const tab = (await json("/json/list")).find((t) => t.type === "page" && t.url.startsWith("http"));
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

function metrics(width, height, mobile) {
  return send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
}

async function open(url) {
  await send("Page.navigate", { url });
  await sleep(1400);
}

async function box() {
  return evalExpr(`(() => {
    const a = document.querySelector('a[aria-label="WhatsApp ile yazın"]');
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return {
      href: a.getAttribute("href"),
      bottomGap: Math.round(innerHeight - r.bottom),
      rightGap: Math.round(innerWidth - r.right),
      x: Math.round(r.x + r.width / 2),
      y: Math.round(r.y + r.height / 2),
      scrollY: Math.round(scrollY),
    };
  })()`);
}

await send("Page.enable");
await metrics(390, 844, true);
await open("http://localhost:3000/");
const slug = await evalExpr(`document.querySelector('a[href^="/paket/"]')?.getAttribute("href") || ""`);
console.log("slug", slug);

const beforeScroll = await box();
await evalExpr(`scrollTo(0, 1400)`);
await sleep(300);
const afterScroll = await box();
console.log("mobile-before-scroll", JSON.stringify(beforeScroll));
console.log("mobile-after-scroll", JSON.stringify(afterScroll));

if (slug) {
  await open("http://localhost:3000" + slug);
  console.log("paket-mobile", JSON.stringify(await box()));
  await metrics(1440, 900, false);
  await sleep(400);
  console.log("paket-desktop", JSON.stringify(await box()));
}

const b = await box();
await send("Input.dispatchMouseEvent", {
  type: "mousePressed",
  x: b.x,
  y: b.y,
  button: "left",
  clickCount: 1,
});
await send("Input.dispatchMouseEvent", {
  type: "mouseReleased",
  x: b.x,
  y: b.y,
  button: "left",
  clickCount: 1,
});
await sleep(1800);
const tabs = (await json("/json/list"))
  .filter((t) => t.type === "page")
  .map((t) => t.url);
console.log("pages", tabs);

ws.close();
process.exit(0);
