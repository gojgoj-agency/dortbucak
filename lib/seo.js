import { site } from "@/lib/site";

export function siteOrigin() {
  return site.url.replace(/\/$/, "");
}

export function abs(path = "/") {
  if (!path) return siteOrigin();
  if (/^https?:\/\//i.test(path)) return path;
  return siteOrigin() + (path.startsWith("/") ? path : `/${path}`);
}

export function phoneE164() {
  const digits = site.phone.replace(/\D/g, "");
  return digits ? `+${digits}` : undefined;
}

export const agencyId = () => `${abs("/")}#agency`;

/** Hac ve umre aramalarında sitenin yanıt verdiği yakın ifadeler. */
export const konular = {
  hac: [
    "hac turu",
    "hac turları",
    "hac programı",
    "hac programları",
    "hac paketi",
    "hac paketleri",
    "hac organizasyonu",
    "hac seyahati",
    "hac ziyareti",
    "hac kaydı",
    "hac fiyatları",
    "hac vizesi",
    "ekonomik hac",
    "ankara hac turu",
    "ankara hac turları",
    "ankara hac acentesi",
    "keçiören hac turu",
    "mekke hac",
    "medine hac",
    "mekke medine hac",
    "kutsal topraklar hac",
    "rehberli hac",
    "2026 hac turu",
    "2027 hac turu",
  ],
  umre: [
    "umre turu",
    "umre turları",
    "umre programı",
    "umre programları",
    "umre paketi",
    "umre paketleri",
    "umre organizasyonu",
    "umre seyahati",
    "umre ziyareti",
    "umre fiyatları",
    "umre vizesi",
    "ekonomik umre",
    "ankara umre",
    "ankara umre turu",
    "ankara umre turları",
    "keçiören umre",
    "mekke umre",
    "medine umre",
    "mekke medine turu",
    "mekke medine umre",
    "ramazan umresi",
    "bayram umresi",
    "rehberli umre",
  ],
  birlikte: [
    "hac ve umre",
    "hac umre",
    "hac umre turları",
    "hac umre turu",
    "hac umre acentesi",
    "hac umre organizasyonu",
    "ankara hac ve umre",
    "ankara hac umre",
    "keçiören hac umre",
    "dört bucak tur",
    "dört bucak tur hac",
    "dört bucak tur umre",
    "dortbucaktur",
  ],
  en: [
    "hajj tour ankara",
    "hajj package turkey",
    "hajj agency ankara",
    "umrah tour ankara",
    "umrah package ankara",
    "umrah agency ankara",
    "mecca medina tour",
    "mecca medina package",
    "guided hajj",
    "guided umrah",
    "dort bucak tur hajj",
    "dort bucak tur umrah",
  ],
};

export const anahtarKelimeler = [
  ...konular.hac.slice(0, 8),
  ...konular.umre.slice(0, 8),
  ...konular.birlikte.slice(0, 6),
  "Mekke",
  "Medine",
];

export function sayfaMeta({ title, description, path, images = [] }) {
  const ogImages = images.filter(Boolean).map((url) => ({ url }));
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      locale: "tr_TR",
      type: "website",
      siteName: site.name,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages.length ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImages.length ? { images: ogImages.map((img) => img.url) } : {}),
    },
  };
}

export function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

export function agencyLd() {
  const address = site.addressParts;
  return {
    "@type": "TravelAgency",
    "@id": agencyId(),
    name: site.name,
    url: abs("/"),
    description:
      "Ankara Keçiören merkezli hac ve umre organizasyonu. Rehberli Mekke ve Medine programları.",
    telephone: phoneE164(),
    email: site.email,
    image: abs("/images/slider-1-masaustu.webp"),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.locality,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    areaServed: [
      { "@type": "City", name: "Ankara" },
      { "@type": "Country", name: "Türkiye" },
    ],
    knowsAbout: [
      "Hac turu",
      "Hac programı",
      "Hac paketi",
      "Hac organizasyonu",
      "Umre turu",
      "Umre programı",
      "Umre paketi",
      "Umre organizasyonu",
      "Mekke ve Medine konaklama",
      "Ankara hac ve umre organizasyonu",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hac ve umre turları",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hac turu",
            url: abs("/hac-turlari"),
            areaServed: "Mekke ve Medine",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Umre turu",
            url: abs("/umre-turlari"),
            areaServed: "Mekke ve Medine",
          },
        },
      ],
    },
    sameAs: [site.instagram, site.facebook, site.google].filter(Boolean),
  };
}

export function siteGraphLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      agencyLd(),
      {
        "@type": "WebSite",
        "@id": `${abs("/")}#website`,
        url: abs("/"),
        name: site.name,
        inLanguage: "tr-TR",
        description:
          "Ankara hac ve umre turları. Rehberli hac programı ve umre programı için Dört Bucak Tur.",
        publisher: { "@id": agencyId() },
      },
    ],
  };
}
