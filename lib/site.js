// Firma iletişim bilgileri. Telefon, Google işletme kaydındaki numaradır.
const addressParts = {
  street: "Subayevleri Mh. Şehit Ömer Halisdemir Bulv. No: 47/B (Protokol Yolu Altınpark Karşısı)",
  postalCode: "06135",
  locality: "Keçiören",
  region: "Ankara",
  country: "Türkiye",
  countryCode: "TR",
};
const address = `${addressParts.street}, ${addressParts.postalCode} ${addressParts.locality}/${addressParts.region}`;

export const site = {
  name: "Dört Bucak Tur",
  slogan: "Her Detayda Özen, Her Adımda Güven, Her Anlamda Huzur",
  url: process.env.SITE_URL || "http://localhost:3000",
  phone: "+90 501 077 99 42",
  whatsapp: "+905010779942",
  email: "bilgi@dortbucaktur.com",
  hours: "Hafta içi ve Cumartesi 09:00–18:00",
  address,
  addressParts,
  instagram: "https://www.instagram.com/dortbucaktur",
  facebook: "https://www.facebook.com/profile.php?id=61579544175018",
  google: "https://maps.app.goo.gl/7zi9HUHtiiQtNm3R7",
  mapLink: "https://maps.app.goo.gl/7zi9HUHtiiQtNm3R7",
  mapEmbed:
    "https://maps.google.com/maps?q=D%C3%B6rt%20Bucak%20Tur%20Seyahat%20Acentas%C4%B1%20%C5%9Eehit%20%C3%96mer%20Halisdemir%20Bulvar%C4%B1%2047%2FB%20Ke%C3%A7i%C3%B6ren%20Ankara&hl=tr&z=16&output=embed",
};

export const turKategorileri = {
  umre: { etiket: "Umre", sayfa: "Umre Turları", href: "/umre-turlari", tur: "umre turu" },
  hac: { etiket: "Hac", sayfa: "Hac Programları", href: "/hac-turlari", tur: "hac programı" },
  kultur: { etiket: "Kültür", sayfa: "Kültür Turları", href: "/kultur-turlari", tur: "kültür turu" },
  kisisel: { etiket: "Kişisel", sayfa: "Kişiye Özel Turlar", href: "/kisiye-ozel-turlar", tur: "kişiye özel tur" },
};

export function kategoriBilgi(category) {
  return turKategorileri[category] || turKategorileri.umre;
}

export const odaFarki =
  "14 günlük programlarda ilan edilen tutar 4 kişilik odada kişi başıdır.";

// WhatsApp numarası girilmemişse bağlantı iletişim sayfasına yönlendirir.
export function waLink(message = "Merhaba") {
  const num = site.whatsapp.replace(/\D/g, "");
  if (!num) return "/iletisim";
  return `https://api.whatsapp.com/send?phone=+${num}&text=${encodeURIComponent(message)}`;
}
export const hasWa = () => /\d{6,}/.test(site.whatsapp);
export const telLink = () => {
  const digits = site.phone.replace(/\D/g, "");
  if (digits.length < 6) return "/iletisim";
  return `tel:+${digits}`;
};

export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const aylar = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  if (!y || !m || !d) return iso;
  return `${d} ${aylar[m - 1]} ${y}`;
}
/** SVG ve Blob vekili next/image ile kırılır; tarayıcı doğrudan yüklesin. */
export function hamGorsel(src) {
  if (!src) return false;
  return src.startsWith("/api/dosya/") || /\.svg(\?|$)/i.test(src);
}

export function formatPrice(v, currency) {
  if (v === null || v === undefined || v === "" || Number(v) <= 0) return null;
  const sym = { USD: "$", EUR: "€", TRY: "₺", SAR: "SAR " }[currency] || currency + " ";
  return `${sym}${Number(v).toLocaleString("tr-TR")}`;
}
