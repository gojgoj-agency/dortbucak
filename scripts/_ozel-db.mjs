async function titlesOf(url) {
  const html = await fetch(url).then((r) => r.text());
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "");
  return [...body.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").replace(/<!-- -->/g, "").trim());
}
console.log("first", await titlesOf("http://localhost:3000/kisiye-ozel-turlar?n=4"));
console.log("second", await titlesOf("http://localhost:3000/kisiye-ozel-turlar?n=5"));
