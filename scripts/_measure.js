import { WebSocket } from "undici";

const list = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const tab = list.find((t) => t.webSocketDebuggerUrl);
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
async function evalAt(width, height, url) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: width < 800,
  });
  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 1800));
  const expr = `(() => {
    const nav = document.querySelector('nav[aria-label="Ana menü"]');
    const bar = document.querySelector('header .site-container');
    const cards = [...document.querySelectorAll('section[aria-label="Öne çıkanlar"] p')].slice(0, 8).map((p) => ({
      t: p.textContent.trim().slice(0, 40),
      w: Math.round(p.getBoundingClientRect().width),
      h: Math.round(p.getBoundingClientRect().height),
    }));
    return {
      items: nav ? [...nav.querySelectorAll("a")].map((a) => a.textContent.trim()) : [],
      navOverflow: nav ? nav.scrollWidth > nav.clientWidth + 2 : null,
      navW: nav ? nav.scrollWidth : null,
      barW: bar ? bar.clientWidth : null,
      cards,
    };
  })()`;
  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
  console.log(width, JSON.stringify(res.result?.result?.value, null, 0));
}
await evalAt(1440, 900, "http://localhost:3000/");
await evalAt(1280, 900, "http://localhost:3000/");
await evalAt(1024, 900, "http://localhost:3000/");
ws.close();
