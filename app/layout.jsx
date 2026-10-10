import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { anahtarKelimeler, siteGraphLd } from "@/lib/seo";
import favicon from "./faviconV2.webp";

// Fontlar yerelde barındırılır (hız + gizlilik). Türkçe karakter desteği tamdır.
const display = localFont({ src: "./fonts/Fraunces.ttf", variable: "--font-display", display: "swap" });
const sans = localFont({ src: "./fonts/Manrope.ttf", variable: "--font-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Dört Bucak Tur | Ankara Hac ve Umre Turları", template: "%s | Dört Bucak Tur" },
  description:
    "Ankara Keçiören merkezli Dört Bucak Tur ile rehberli hac ve umre programları. 14 günlük umre fiyatları; tarih ve kayıt için bize ulaşın.",
  applicationName: "Dört Bucak Tur",
  authors: [{ name: "Dört Bucak Tur", url: site.url }],
  creator: "Dört Bucak Tur",
  publisher: "Dört Bucak Tur",
  category: "travel",
  keywords: anahtarKelimeler,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    siteName: "Dört Bucak Tur",
    type: "website",
    locale: "tr_TR",
    title: "Dört Bucak Tur | Ankara Hac ve Umre Turları",
    description:
      "Rehberli hac ve umre programları. Mekke ve Medine konaklamalı Ankara organizasyonu.",
  },
  twitter: { card: "summary", title: "Dört Bucak Tur | Ankara Hac ve Umre Turları" },
  icons: {
    icon: [{ url: favicon.src, type: "image/png", sizes: "16x16" }],
    shortcut: [{ url: favicon.src, type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="describedby" href="/llms.txt" />
      </head>
      <body className="bg-fildisi font-sans text-murekkep antialiased">
        <JsonLd data={siteGraphLd()} />
        {/* Kaydırma animasyonları yalnızca JS varsa devreye girsin diye <html>'e
            "js" sınıfı eklenir. Boyamadan önce çalışır; JS yoksa hiçbir içerik
            gizlenmez. */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }}
        />
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
