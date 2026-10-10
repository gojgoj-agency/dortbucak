import favicon from "./faviconV2.webp";

export default function manifest() {
  return {
    name: "Dört Bucak Tur",
    short_name: "Dört Bucak",
    description: "Ankara hac ve umre turları. Rehberli Mekke ve Medine programları.",
    start_url: "/",
    display: "browser",
    lang: "tr",
    background_color: "#F7F2EA",
    theme_color: "#1B2A4A",
    icons: [{ src: favicon.src, sizes: "16x16", type: "image/webp", purpose: "any" }],
  };
}
