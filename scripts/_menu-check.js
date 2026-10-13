const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const out = path.join(__dirname, "_menu-shot.png");
const port = 9222;

const chromeProc = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=" + path.join(require("os").tmpdir(), "dortbucak-menu-check"),
  "about:blank",
], { stdio: "ignore" });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function cdp() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return r.json();
    } catch {}
    await sleep(200);
  }
  throw new Error("chrome cdp yok");
}

(async () => {
  const version = await cdp();
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
  function send(method, params = {}, sessionId) {
    const msgId = ++id;
    return new Promise((resolve, reject) => {
      pending.set(msgId, (msg) => (msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)));
      const payload = { id: msgId, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  }, sessionId);
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send("Page.navigate", { url: "http://localhost:3000/iletisim" }, sessionId);
  await sleep(1500);
  const ready = await send("Runtime.evaluate", {
    expression: `new Promise((resolve) => {
      const start = Date.now();
      const tick = () => {
        const btn = document.querySelector('button[aria-controls="mobil-menu"]');
        if (btn && !document.querySelector("nextjs-portal")) return resolve("ready");
        if (Date.now() - start > 8000) return resolve(document.body.innerText.slice(0, 180));
        setTimeout(tick, 200);
      };
      tick();
    })`,
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
  console.log("ready", ready.result.value);

  const clicked = await send("Runtime.evaluate", {
    expression: `new Promise((resolve) => {
      const btn = document.querySelector('button[aria-controls="mobil-menu"]');
      if (!btn) return resolve("no-button");
      btn.click();
      const start = Date.now();
      const tick = () => {
        const menu = document.getElementById("mobil-menu");
        const cs = getComputedStyle(menu);
        if (cs.opacity === "1" || Date.now() - start > 3000) {
          const link = menu.querySelector("a");
          const lcs = getComputedStyle(link);
          const rect = link.getBoundingClientRect();
          resolve(JSON.stringify({
            className: menu.className,
            bg: cs.backgroundColor,
            opacity: cs.opacity,
            visibility: cs.visibility,
            color: lcs.color,
            linkText: link.textContent.trim(),
            linkTop: rect.top,
            expanded: btn.getAttribute("aria-expanded"),
          }));
        } else setTimeout(tick, 100);
      };
      tick();
    })`,
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
  console.log(clicked.result.value);

  await sleep(600);
  const shot = await send("Page.captureScreenshot", { format: "png" }, sessionId);
  fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log("wrote", out);
  ws.close();
  chromeProc.kill();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  chromeProc.kill();
  process.exit(1);
});
