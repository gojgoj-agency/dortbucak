const { spawn } = require("child_process");
const WebSocket = require("ws");
const os = require("os");
const path = require("path");
const port = 9334;
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=" + path.join(os.tmpdir(), "dortbucak-nav-check2"),
  "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let version;
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) { version = await r.json(); break; } } catch {}
    await sleep(200);
  }
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  let id = 0; const pending = new Map();
  ws.addEventListener("message", (ev) => { const msg = JSON.parse(ev.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } });
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
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send("Page.navigate", { url: "http://localhost:3000/" }, sessionId);
  await sleep(1500);
  const sonuc = await send("Runtime.evaluate", {
    expression: `(() => {
      const vw = document.documentElement.clientWidth;
      const disari = [...document.querySelectorAll("header a, header button")].map((el) => ({ t: el.innerText.replace(/\\s+/g," ").trim().slice(0,40), right: Math.round(el.getBoundingClientRect().right) })).filter((x) => x.right > vw + 1);
      return JSON.stringify({ overflow: document.documentElement.scrollWidth > window.innerWidth + 1, scroll: document.documentElement.scrollWidth, vw, disari, nav: document.querySelector("header nav").innerText.replace(/\\s+/g," ").trim() });
    })()`,
    returnByValue: true,
  }, sessionId);
  console.log(sonuc.result.value);
  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
