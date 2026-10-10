import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenText, HeartHandshake, MessagesSquare, Phone } from "lucide-react";
import HomeSlider from "@/components/HomeSlider";
import PackageCard from "@/components/PackageCard";
import Faq from "@/components/Faq";
import Reveal, { RevealGrup, RevealOge } from "@/components/Reveal";
import { getPackages, getSliders } from "@/lib/db";
import { odaFarki, site, waLink, telLink } from "@/lib/site";
import { WaIcon } from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dört Bucak Tur | Ankara Hac ve Umre Turları",
    description:
      "Ankara Keçiören merkezli rehberli hac ve umre programları. 14 günlük umre fiyatları ve Mekke–Medine konaklama.",
    url: "/",
  },
};

const surec = [
  ["Bilgi alma", "Telefon veya WhatsApp üzerinden sorularınızı yanıtlıyor, size uygun dönemleri birlikte belirliyoruz."],
  ["Program seçimi", "Tarih, süre ve konaklama tercihinize göre hac veya umre programınızı seçiyorsunuz."],
  ["Hazırlık", "Gerekli belgeler, sağlık ve yolculuk hazırlıkları konusunda adım adım bilgilendiriyoruz."],
  ["Yolculuk", "Rehberlerimiz eşliğinde ibadetlerinizi huzurla yerine getiriyorsunuz."],
];

const nedenler = [
  [HeartHandshake, "Rehberli programlar", "Yolculuk boyunca din görevlisi ve rehber eşliğinde hareket edilir; ibadetler bilerek ve huzurla yapılır."],
  [BookOpenText, "Açık ve dürüst bilgilendirme", "Dahil olan ve olmayan hizmetleri açıkça yazarız; sorularınızı kayıttan önce yanıtlarız."],
  [MessagesSquare, "Kolay ulaşılabilir ekip", "Telefon ve WhatsApp üzerinden bize her aşamada kolayca ulaşabilirsiniz."],
];

const kategoriler = [
  {
    href: "/hac-turlari",
    baslik: "Hac Turları",
    metin: "Hac programlarımızı, tarihlerini ve konaklama planlarını inceleyin.",
    gorsel: "/images/paket-hac-1.webp",
    alt: "Mekke ve Medine hac programı",
  },
  {
    href: "/umre-turlari",
    baslik: "Umre Turları",
    metin: "Yıl boyu düzenlenen umre programlarımıza göz atın.",
    gorsel: "/images/paket-umre-2.webp",
    alt: "Mekke ve Medine umre programı",
  },
];

const guvenceler = [
  ["Rehber eşliğinde", "Din görevlisi ve rehberle birlikte hareket"],
  ["Mekke & Medine", "Her programda iki kutsal şehir"],
  ["14 günlük umre", "4 kişilik odada ilan edilen kişi başı fiyat"],
  ["Ankara ofisi", "Keçiören Subayevleri’nden kolay ulaşım"],
];

const donemler = [
  { ad: "Ekim – Kasım", fiyat: "1.450", href: "/paket/ekim-kasim-umresi", ramazan: false },
  { ad: "Aralık – Ocak", fiyat: "1.550", href: "/paket/aralik-ocak-umresi", ramazan: false },
  { ad: "Yarı Ramazan", fiyat: "1.600", href: "/paket/yari-ramazan-umresi", ramazan: true },
  { ad: "Tam Ramazan", fiyat: "1.900", href: "/paket/tam-ramazan-umresi", ramazan: true },
];

const sssSecme = [
  ["Umre programları kaç gün sürüyor?", "İlan edilen umre programlarımız 14 gündür. Çıkış tarihi seçtiğiniz döneme göre değişir."],
  ["3 ve 2 kişilik oda farkı ne kadar?", "İlan edilen fiyat 4 kişilik odada kişi başıdır. 3 ve 2 kişilik odalarda kişi başı 75 dolar, Ramazan umrelerinde 100 dolar eklenir."],
  ["Yolculuk boyunca rehber eşlik ediyor mu?", "Evet, programlarımızda din görevlisi ve rehber eşliğinde hareket edilir; ibadetler topluca yerine getirilir."],
];

function BolumBasligi({ kicker, baslik, aciklama, acik = false, id }) {
  return (
    <Reveal className="text-center">
      {kicker && <p className={acik ? "kicker-acik" : "kicker"}>{kicker}</p>}
      <h2 id={id} className={`mt-3 text-2xl md:text-3xl ${acik ? "!text-fildisi" : ""}`}>
        {baslik}
      </h2>
      <div className="baslik-cizgi" />
      {aciklama && (
        <p className={`olcu mx-auto mt-5 ${acik ? "text-fildisi/75" : "text-gri"}`}>{aciklama}</p>
      )}
    </Reveal>
  );
}

export default async function Home() {
  const sliders = await getSliders();
  const featured = (await getPackages({ featured: true })).slice(0, 6);
  const programListesi = featured.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Öne çıkan hac ve umre programları",
        itemListElement: featured.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: abs(`/paket/${p.slug}`),
        })),
      }
    : null;

  return (
    <>
      {programListesi && <JsonLd data={programListesi} />}
      <HomeSlider slides={sliders} />

      {/* Güvence şeridi — hero'nun üstüne biraz taşarak sayfayı birbirine bağlar */}
      <section className="site-container relative z-10 -mt-8 md:-mt-14" aria-label="Öne çıkanlar">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guvenceler.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-cizgi bg-kagit px-6 py-7 shadow-kartust">
                <span className="mb-4 block h-1 w-10 rounded-full bg-altin" aria-hidden />
                <p className="font-display text-lg text-cam">{t}</p>
                <p className="mt-1.5 text-sm text-gri">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mt-20 bg-kagit py-16 md:py-20" aria-labelledby="donem-fiyatlari">
        <div className="site-container">
        <BolumBasligi
          id="donem-fiyatlari"
          kicker="14 günlük umre"
          baslik="Dönem fiyatları"
          aciklama="Tutarlar 4 kişilik odada kişi başıdır. Çıkış tarihi için bize yazın."
        />
        <RevealGrup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aralik={0.08}>
          {donemler.map((d) => (
            <RevealOge key={d.ad}>
              <Link
                href={d.href}
                className="group flex h-full flex-col rounded-2xl border border-cizgi bg-fildisi p-6 shadow-kart transition-all duration-500 ease-yumusak hover:-translate-y-1 hover:border-altin/40 hover:shadow-kartust"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-altin">
                  {d.ramazan ? "Ramazan" : "Dönem"}
                </p>
                <h3 className="mt-3 text-xl">{d.ad}</h3>
                <p className="mt-4 font-display text-3xl text-cam">
                  {d.fiyat}
                  <span className="ml-1 text-lg">$</span>
                </p>
                <p className="mt-1 text-sm text-gri">4 kişilik odada kişi başı</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-altin">
                  Programı incele
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-yumusak group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </RevealOge>
          ))}
        </RevealGrup>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-gri">{odaFarki}</p>
        </div>
      </section>

      {/* Kategori kartları — artık gerçek fotoğraflarla */}
      <section className="site-container mt-20" aria-label="Kategoriler">
        <RevealGrup className="grid gap-6 md:grid-cols-2">
          {kategoriler.map((k) => (
            <RevealOge key={k.href}>
              <Link
                href={k.href}
                className="grup-yakinlas group relative flex h-72 items-end overflow-hidden rounded-[1.75rem] shadow-kart ring-1 ring-cam/10 transition-all duration-500 ease-yumusak hover:-translate-y-1.5 hover:shadow-kartust md:h-80"
              >
                <Image
                  src={k.gorsel}
                  alt={k.alt}
                  fill
                  sizes="(max-width: 768px) 92vw, 560px"
                  className="gorsel-yakinlas object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-camgece/90 via-camgece/45 to-camgece/10" aria-hidden />
                <div className="relative w-full p-7">
                  <h2 className="font-display text-2xl !text-fildisi">{k.baslik}</h2>
                  <p className="mt-2 max-w-sm text-fildisi/80">{k.metin}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-altinparlak">
                    Programları görüntüle
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-yumusak group-hover:translate-x-1.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </RevealOge>
          ))}
        </RevealGrup>
      </section>

      {/* Öne çıkan paketler */}
      {featured.length > 0 && (
        <section className="site-container mt-24" aria-labelledby="one-cikan">
          <BolumBasligi
            id="one-cikan"
            kicker="Programlarımız"
            baslik="Öne Çıkan Programlar"
            aciklama="Tarih, süre ve konaklama planlarıyla hazırladığımız hac ve umre programlarından bir seçki."
          />
          <RevealGrup className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3" aralik={0.09}>
            {featured.map((p) => (
              <RevealOge key={p.id} className="flex">
                <div className="flex w-full">
                  <PackageCard p={p} />
                </div>
              </RevealOge>
            ))}
          </RevealGrup>
        </section>
      )}

      {/* Neden Dört Bucak Tur */}
      <section className="doku relative mt-24 overflow-hidden bg-cam py-20 text-fildisi" aria-labelledby="neden">
        <div className="site-container relative">
          <BolumBasligi id="neden" kicker="Yaklaşımımız" baslik="Neden Dört Bucak Tur?" acik />
          <RevealGrup className="mt-12 grid gap-6 md:grid-cols-3">
            {nedenler.map(([Ikon, t, d]) => (
              <RevealOge key={t}>
                <div className="h-full rounded-2xl border border-fildisi/10 bg-fildisi/[0.04] p-7 backdrop-blur-sm transition-colors duration-500 ease-yumusak hover:border-altinacik/35 hover:bg-fildisi/[0.07]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-altinacik/30 bg-altinacik/10 text-altinparlak">
                    <Ikon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl !text-altinacik">{t}</h3>
                  <p className="mt-2 text-fildisi/80">{d}</p>
                </div>
              </RevealOge>
            ))}
          </RevealGrup>
        </div>
      </section>

      {/* Yolculuk süreci */}
      <section className="site-container mt-24" aria-labelledby="surec">
        <BolumBasligi
          id="surec"
          kicker="Adım adım"
          baslik="Yolculuk Süreci"
          aciklama="İlk telefondan dönüş gününe kadar izlediğimiz yol."
        />
        <RevealGrup className="relative mt-12 grid gap-6 md:grid-cols-4" aralik={0.1}>
          {/* Adımları birbirine bağlayan ince çizgi */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-cizgi to-transparent md:block"
            aria-hidden
          />
          {surec.map(([t, d], i) => (
            <RevealOge key={t}>
              <div className="relative h-full rounded-2xl border border-cizgi bg-kagit p-6 shadow-kart transition-all duration-500 ease-yumusak hover:-translate-y-1.5 hover:border-altin/30 hover:shadow-kartust">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cam font-display text-lg text-altinparlak shadow-kart">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl">{t}</h3>
                <p className="mt-1.5 text-gri">{d}</p>
              </div>
            </RevealOge>
          ))}
        </RevealGrup>
      </section>

      {/* Kısa bilgilendirme + SSS */}
      <section className="site-container mt-24 grid gap-7 md:grid-cols-2" aria-labelledby="bilgi">
        <Reveal yon="sol">
          <div className="kart h-full p-8">
            <p className="kicker">Bilgilendirme</p>
            <h2 id="bilgi" className="mt-3 text-2xl">Hac ve Umre Hakkında</h2>
            <p className="mt-4 text-gri">
              Hac, İslam'ın beş şartından biridir ve yılın belirli günlerinde, hac mevsiminde yerine
              getirilir. Umre ise yıl boyunca yapılabilen, Kâbe'yi tavaf ve sa'y ibadetlerini içeren
              bir ziyarettir.
            </p>
            <p className="mt-3 text-gri">
              Her iki yolculukta da hazırlık, belgeler ve ibadetlerin yapılışı hakkında ekibimiz size
              adım adım eşlik eder. Vize, pasaport, aşı ve resmî seyahat şartları zaman içinde
              değişebilir; güncel bilgiler kayıt sırasında paylaşılır.
            </p>
          </div>
        </Reveal>

        <Reveal yon="sag">
          <div className="kart h-full p-8">
            <p className="kicker">Merak edilenler</p>
            <h2 className="mt-3 text-2xl">Sık Sorulanlardan</h2>
            <div className="mt-5"><Faq items={sssSecme} /></div>
            <Link
              href="/sss"
              className="group mt-5 inline-flex items-center gap-2 font-semibold text-altin hover:underline"
            >
              Tüm soruları görüntüle
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-yumusak group-hover:translate-x-1.5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* İletişim çağrısı */}
      <section className="site-container mt-24" aria-labelledby="cagri">
        <Reveal>
          <div className="doku relative overflow-hidden rounded-[1.75rem] bg-camderin px-7 py-16 text-center text-fildisi shadow-derin ring-1 ring-altinacik/20">
            <div className="relative">
              <p className="kicker-acik">İletişim</p>
              <h2 id="cagri" className="mt-3 text-2xl !text-fildisi md:text-3xl">
                Size nasıl yardımcı olabiliriz?
              </h2>
              <div className="baslik-cizgi" />
              <p className="olcu mx-auto mt-5 text-fildisi/80">
                Program tarihleri, fiyatlar ve kayıt şartları hakkında bilgi almak için bize ulaşın.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener"
                  className="btn-wa"
                >
                  <WaIcon /> WhatsApp'tan Bilgi Al
                </a>
                <a href={telLink()} className="btn-cam-uzeri">
                  <Phone className="h-4 w-4" aria-hidden /> {site.phone}
                </a>
              </div>
              <p className="mt-8 text-sm text-fildisi/65">
                {site.address} ·{" "}
                <Link href="/iletisim" className="underline underline-offset-4 hover:text-altinacik">
                  Adres ve harita için iletişim sayfası
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
