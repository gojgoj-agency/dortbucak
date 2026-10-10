// Temsili görselleri üretir (soyut kemer motifi). Gerçek fotoğraflar yüklendiğinde gerek kalmaz.
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(dir, { recursive: true });

function arch(w, h, g1, g2, gold, label) {
  const aw = w * 0.42, ah = h * 0.78, ax = (w - aw) / 2, ay = h * 0.16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/>
</linearGradient>
<linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${gold}" stop-opacity="0.35"/><stop offset="1" stop-color="${gold}" stop-opacity="0.05"/>
</linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>
<g opacity="0.08" stroke="${gold}" fill="none" stroke-width="1">
${Array.from({ length: 7 }, (_, i) => {
  const r = 60 + i * 70;
  return `<circle cx="${w / 2}" cy="${ay + aw / 2}" r="${r}"/>`;
}).join("")}
</g>
<path d="M ${ax} ${ay + ah} L ${ax} ${ay + aw / 2} A ${aw / 2} ${aw / 2} 0 0 1 ${ax + aw} ${ay + aw / 2} L ${ax + aw} ${ay + ah} Z" fill="url(#in)" stroke="${gold}" stroke-opacity="0.55" stroke-width="2"/>
<path d="M ${ax + 14} ${ay + ah} L ${ax + 14} ${ay + aw / 2 + 6} A ${aw / 2 - 14} ${aw / 2 - 14} 0 0 1 ${ax + aw - 14} ${ay + aw / 2 + 6} L ${ax + aw - 14} ${ay + ah} Z" fill="none" stroke="${gold}" stroke-opacity="0.3" stroke-width="1"/>
<circle cx="${w / 2}" cy="${ay + aw / 2 - aw * 0.12}" r="${aw * 0.05}" fill="none" stroke="${gold}" stroke-opacity="0.5" stroke-width="1.5"/>
${label ? `<text x="${w / 2}" y="${h - 18}" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${gold}" fill-opacity="0.6" letter-spacing="3">${label}</text>` : ""}
</svg>`;
}

const files = {
  "slider-1.svg": arch(1600, 700, "#0B3226", "#092A20", "#D9C089", "TEMSİLİ GÖRSEL"),
  "slider-2.svg": arch(1600, 700, "#123F2F", "#0B3226", "#D9C089", "TEMSİLİ GÖRSEL"),
  "paket-umre-1.svg": arch(900, 620, "#10402F", "#0A2E23", "#D9C089", ""),
  "paket-umre-2.svg": arch(900, 620, "#155039", "#0C3527", "#D9C089", ""),
  "paket-umre-3.svg": arch(900, 620, "#0E3B2E", "#08251C", "#D9C089", ""),
  "paket-hac-1.svg": arch(900, 620, "#0B3226", "#123F2F", "#D9C089", ""),
  "paket-hac-2.svg": arch(900, 620, "#0A2E23", "#155039", "#D9C089", ""),
  "paket-hac-3.svg": arch(900, 620, "#092A20", "#10402F", "#D9C089", ""),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), svg);
console.log("images ok");
