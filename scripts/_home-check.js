fetch("http://localhost:3000/").then(async (r) => {
  const t = await r.text();
  console.log(["status", r.status, "yeni", t.includes("her yerinden"), "eski", t.includes("Ankara'dan kutsal"), "wp", t.includes("Size uygun umre turunu"), "hac", t.includes("Hac Programlar")].join(" "));
});
