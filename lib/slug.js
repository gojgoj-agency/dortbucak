// Türkçe karakterleri SEO uyumlu bağlantıya dönüştürür.
const map = { ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u" };
export function slugify(text) {
  return String(text || "")
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (c) => map[c])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
