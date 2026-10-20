const ozel = await (await fetch("http://localhost:3000/kisiye-ozel-turlar?v=" + Date.now())).text();
const home = await (await fetch("http://localhost:3000/?v=" + Date.now())).text();
console.log("ozel status image", ozel.includes("/images/ozeltur.webp"), "old", ozel.includes("paket-umre-3"));
console.log("home", home.includes("slider-sekme"), home.includes("via-camgece/80"), home.includes("Umre"), home.includes("Kültür") || home.includes("K&#252;lt&#252;r") || home.includes("K\\u00fclt\\u00fcr"));
