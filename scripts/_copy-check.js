async function check(url, keys) {
  const r = await fetch(url);
  const t = await r.text();
  console.log("\n==", url, r.status, t.length);
  for (const k of keys) console.log(t.includes(k) ? "OK" : "MISSING", k);
  if (r.status >= 400) {
    console.log(t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600));
  }
}

const home = await fetch("http://localhost:3000/");
const homeText = await home.text();
console.log("\n== /", home.status, homeText.length);
const keys = [
  "Maneviyatla dolu yolculuklar",
  "Güvenli organizasyon",
  "Profesyonel rehberlik",
  "Konforlu hizmet",
  "Her Detayda Özen, Her Adımda Güven,",
  "Her Anlamda Huzur",
  "Kültür Turları",
  "Tarihi keşif, doğayla iç içe",
  "Rehber eşliğinde",
];
for (const k of keys) console.log(homeText.includes(k) ? "OK" : "MISSING", k);
const nav = [...homeText.matchAll(/href="(\/(?:umre-turlari|hac-turlari|kultur-turlari))"/g)].map((m) => m[1]);
console.log("nav order", [...new Set(nav)].join(" > "));
if (home.status >= 400) console.log(homeText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 700));
await check("http://localhost:3000/kultur-turlari", [
  "Tarihe ve Doğaya Yolculuk",
  "Tarihi Keşif",
  "Doğa ile İç İçe",
  "Kültürel Deneyim",
  "Eşsiz Rotalar",
  "kultur-turlari.png",
]);
await check("http://localhost:3000/umre-turlari", ["Umre Turları"]);
await check("http://localhost:3000/hac-turlari", ["Hac Programları"]);
