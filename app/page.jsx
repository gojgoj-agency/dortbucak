import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Compass,
  HeartHandshake,
  Hotel,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import HomeSlider from "@/components/HomeSlider";
import PackageCard from "@/components/PackageCard";
import Faq from "@/components/Faq";
import Reveal, { RevealGrup, RevealOge } from "@/components/Reveal";
import { getFaqs, getPackages, getSliders } from "@/lib/db";
import { odaFarki, site, waLink, telLink } from "@/lib/site";
import { WaIcon } from "@/components/SocialLinks";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dört Bucak Tur | Ankara Hac ve Umre Turları",
    description:
      "Ankara merkezli rehberli hac ve umre programları. 14 günlük umre fiyatları ve Mekke–Medine konaklama.",
    url: "/",
  },
};

const guvenceler = [
  [Sparkles, "Maneviyatla dolu yolculuklar", "İbadetler bilerek ve huzurla"],
  [ShieldCheck, "Güvenli organizasyon", "Her aşaması planlı ve şeffaf"],
  [Compass, "Profesyonel rehberlik", "Din görevlisi ve rehber eşliğinde"],
  [Hotel, "Konforlu hizmet", "Konaklama ve ulaşımda özen"],
];

const donemler = [
  { ad: "Ekim – Kasım", fiyat: "1.450", href: "/paket/ekim-kasim-umresi", ramazan: false },
  { ad: "Aralık – Ocak", fiyat: "1.550", href: "/paket/aralik-ocak-umresi", ramazan: false },
  { ad: "Yarı Ramazan", fiyat: "1.600", href: "/paket/yari-ramazan-umresi", ramazan: true },
  { ad: "Tam Ramazan", fiyat: "1.900", href: "/paket/tam-ramazan-umresi", ramazan: true },
];

const kategoriler = [
  {
    href: "/umre-turlari",
    kicker: "Yıl boyu",
    baslik: "Umre Turları",
    metin: "14 günlük, rehberli umre programlarımıza ve dönem fiyatlarına göz atın.",
    gorsel: "/images/hac.jpg",
    konum: "object-[78%_center]",
    kadraj: "origin-[78%_8%] scale-[1.85]",
    alt: "Mekke ve Medine umre programı",
  },
  {
    href: "/hac-turlari",
    kicker: "Ömürde bir kez",
    baslik: "Hac Programları",
    metin: "Hac programlarımızı, tarihlerini ve Mekke–Medine konaklama planlarını inceleyin.",
    gorsel: "/images/hac.jpg",
    konum: "object-[24%_center]",
    kadraj: "origin-[24%_8%] scale-[1.85]",
    alt: "Mekke ve Medine hac programı",
  },
  {
    href: "/kultur-turlari",
    kicker: "Tarihe ve doğaya",
    baslik: "Kültür Turları",
    metin: "Tarihi keşif, doğayla iç içe rotalar ve kültürel deneyimle hazırlanan yolculuklar.",
    gorsel: "/images/kultur.jpg",
    alt: "Kültür turları: tarihe ve doğaya yolculuk",
  },
  {
    href: "/kisiye-ozel-turlar",
    kicker: "Size göre",
    baslik: "Özel Turlar",
    metin: "Tarih, süre ve güzergâhı birlikte belirlediğimiz programlar.",
    gorsel: "/images/ozeltur.webp",
    alt: "Özel tur planı",
  },
];

const nedenler = [
  [HeartHandshake, "Rehberli programlar", "Yolculuk boyunca din görevlisi ve rehber eşliğinde hareket edilir; ibadetler bilerek ve huzurla yapılır."],
  [BookOpenText, "Açık ve dürüst bilgilendirme", "Dahil olan ve olmayan hizmetleri açıkça yazarız; sorularınızı kayıttan önce yanıtlarız."],
  [MessagesSquare, "Kolay ulaşılabilir ekip", "Telefon ve WhatsApp üzerinden bize her aşamada kolayca ulaşabilirsiniz."],
  [ShieldCheck, "Şeffaf fiyatlandırma", "Oda tipine göre kişi başı fiyatları ve oda farklarını baştan paylaşırız."],
];

const surec = [
  ["Bilgi alma", "Telefon veya WhatsApp üzerinden sorularınızı yanıtlıyor, size uygun dönemleri birlikte belirliyoruz."],
  ["Program seçimi", "Tarih, süre ve konaklama tercihinize göre hac veya umre programınızı seçiyorsunuz."],
  ["Hazırlık", "Gerekli belgeler, sağlık ve yolculuk hazırlıkları konusunda adım adım bilgilendiriyoruz."],
  ["Yolculuk", "Rehberlerimiz eşliğinde ibadetlerinizi huzurla yerine getiriyorsunuz."],
];

function BolumBasligi({ kicker, baslik, vurgu, aciklama, acik = false, id, hizali = "orta" }) {
  const orta = hizali === "orta";
  return (
    <Reveal className={orta ? "text-center" : ""}>
      {kicker && (
        <p className={`${acik ? "kicker-acik" : "kicker"} ${orta ? "kicker-orta" : ""}`}>{kicker}</p>
      )}
      <h2 id={id} className={`baslik-buyuk mt-5 ${acik ? "!text-fildisi" : ""}`}>
        {baslik}
        {vurgu && (
          <>
            {" "}
            <span className={`italic ${acik ? "altin-yazi" : "text-altin"}`}>{vurgu}</span>
          </>
        )}
      </h2>
      {aciklama && (
        <p className={`olcu mt-5 text-[1.05rem] ${orta ? "mx-auto" : ""} ${acik ? "text-fildisi/65" : "text-gri"}`}>
          {aciklama}
        </p>
      )}
    </Reveal>
  );
}

export default async function Home() {
  const sliders = await getSliders();
  const featured = (await getPackages({ featured: true })).slice(0, 6);
  const soruKayitlari = await getFaqs(true);
  const oneCikan = soruKayitlari.filter((s) => s.featured);
  const sssSecme = (oneCikan.length ? oneCikan : soruKayitlari.slice(0, 3)).map((s) => [s.question, s.answer]);
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

      {/* Güvence şeridi — slider’ın alt kenarına biner */}
      <section className={`site-container relative z-30 ${sliders.length ? "-mt-24" : "mt-12"}`} aria-label="Öne çıkanlar">
        <Reveal>
          <div className="grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-camderin/90 shadow-derin backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-4">
            {guvenceler.map(([Ikon, t, d], i) => (
              <div
                key={t}
                className={`group flex items-center gap-4 px-6 py-6 lg:px-7 lg:py-7 ${
                  i > 0 ? "border-t border-white/[0.07] sm:border-t-0" : ""
                } ${i % 2 === 1 ? "sm:border-l sm:border-white/[0.07]" : ""} ${
                  i > 1 ? "sm:border-t sm:border-white/[0.07] xl:border-t-0" : ""
                } ${i > 0 ? "xl:border-l xl:border-white/[0.07]" : ""}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-altinacik/30 bg-altinacik/[0.08] text-altinacik transition-colors duration-500 group-hover:bg-altinacik group-hover:text-camgece">
                  <Ikon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[1.05rem] leading-tight text-fildisi">{t}</p>
                  <p className="mt-1 text-sm leading-snug text-fildisi/55">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Karşılama */}
      <section className="site-container py-24 md:py-28" aria-labelledby="karsilama">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal yon="sol" className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:mx-0">
              <div className="relative aspect-[4/5] w-[78%] overflow-hidden rounded-[2rem] shadow-derin">
                <Image
                  src="/images/paket-umre-1.webp"
                  alt="Kutsal topraklardan bir görünüm"
                  fill
                  sizes="(max-width: 1024px) 70vw, 420px"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-[-8%] right-0 aspect-square w-[52%] overflow-hidden rounded-[1.75rem] border-[6px] border-fildisi shadow-kartust">
                <Image
                  src="/images/paket-hac-2.webp"
                  alt="Hac programından bir görünüm"
                  fill
                  sizes="(max-width: 1024px) 45vw, 260px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -left-3 top-10 hidden rounded-2xl border border-cizgi bg-kagit/95 px-5 py-4 shadow-kartust backdrop-blur sm:block lg:-left-8">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-altin">Umre</p>
                <p className="mt-1 font-display text-2xl leading-none text-cam">14 gün</p>
                <p className="mt-1 text-xs text-gri">Mekke + Medine</p>
              </div>
              <div className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full border border-altinacik/40" aria-hidden />
            </div>
          </Reveal>

          <Reveal yon="sag" className="lg:col-span-6">
            <p className="kicker">Dört Bucak Tur</p>
            <h2 id="karsilama" className="baslik-buyuk mt-5">
              Her Detayda Özen, Her Adımda Güven,{" "}
              <span className="italic text-altin">Her Anlamda Huzur</span>
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-gri">
              Ankara’daki ofisimizden hac, umre, kültür ve özel turlarınızı planlıyoruz. Programlarımızda
              din görevlisi ve rehber eşliğinde hareket edilir; ibadetler bilerek, topluca ve usulüne uygun
              biçimde yerine getirilir.
            </p>
            <p className="mt-4 leading-relaxed text-gri">
              Dahil olan ve olmayan hizmetleri açıkça yazmayı, sorulara net cevap vermeyi ve her aşamada
              ulaşılabilir olmayı ilke ediniyoruz.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Rehberli ibadet programı", "Mekke ve Medine konaklama", "Yazılı hizmet bilgilendirmesi", "Kayıt öncesi danışmanlık"].map((m) => (
                <li key={m} className="flex items-center gap-3 text-[0.95rem] text-cam">
                  <span className="h-1.5 w-1.5 rotate-45 bg-altin" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/hakkimizda" className="btn-cam group">
                Bizi tanıyın
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <a href={telLink()} className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-altin/30 text-altin">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gri">Hemen arayın</span>
                  <span className="block font-display text-lg text-cam">{site.phone}</span>
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dönem fiyatları — koyu, lüks bant */}
      <section className="doku relative overflow-hidden bg-camgece py-24 text-fildisi md:py-28" aria-labelledby="donem-fiyatlari">
        <div className="desen pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div className="site-container relative">
          <BolumBasligi
            id="donem-fiyatlari"
            kicker="14 günlük umre"
            baslik="Dönem"
            vurgu="fiyatları"
            aciklama="Tutarlar 4 kişilik odada kişi başıdır."
            acik
          />
          <p className="mt-3 text-center">
            <a
              href={waLink("Merhaba, size uygun umre turunu birlikte belirlemek istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp ile yazın"
              className="group text-[1.05rem] font-semibold text-altinacik transition-colors hover:text-fildisi"
            >
              <span className="underline decoration-altinacik/45 underline-offset-4 group-hover:decoration-fildisi/40">
                Size uygun umre turunu birlikte belirlemek için bize ulaşın
              </span>
              <span
                className="ml-2 inline-flex h-6 w-6 -translate-y-px items-center justify-center rounded-full bg-[#25D366] align-middle text-white shadow-[0_0_0_3px_rgba(37,211,102,0.22)] transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <WaIcon className="h-3.5 w-3.5" />
              </span>
              <span className="sr-only">WhatsApp ile yazın</span>
            </a>
          </p>
          <RevealGrup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aralik={0.08}>
            {donemler.map((d) => (
              <RevealOge key={d.ad} className="h-full">
                <Link
                  href={d.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-7 transition-all duration-500 ease-yumusak hover:-translate-y-1.5 ${
                    d.ramazan
                      ? "border-altinacik/40 bg-gradient-to-b from-altinacik/[0.14] to-white/[0.02] shadow-altinhale"
                      : "border-white/[0.09] bg-white/[0.03] hover:border-altinacik/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-altinacik">
                      {d.ramazan ? "Ramazan" : "Dönem"}
                    </span>
                    {d.ramazan && (
                      <span className="rounded-full bg-altin-gradyan px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-camgece">
                        Özel
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-2xl !text-fildisi">{d.ad}</h3>
                  <p className="mt-6 flex items-start gap-1">
                    <span className="mt-1.5 font-display text-xl text-altinacik">$</span>
                    <span className="altin-yazi font-display text-[3rem] leading-none">{d.fiyat}</span>
                  </p>
                  <p className="mb-8 mt-2 text-sm text-fildisi/50">4 kişilik odada kişi başı</p>
                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-sm font-semibold text-fildisi/85">
                    <span>{d.ramazan ? "Hac programını incele" : "Programı incele"}</span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-altinacik group-hover:bg-altinacik group-hover:text-camgece">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </RevealOge>
            ))}
          </RevealGrup>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-fildisi/50">{odaFarki}</p>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="site-container pt-24 md:pt-28" aria-label="Kategoriler">
        <RevealGrup className="grid gap-6 sm:grid-cols-2">
          {kategoriler.map((k) => (
            <RevealOge key={k.href}>
              <Link
                href={k.href}
                className="grup-yakinlas group relative flex h-[24rem] items-end overflow-hidden rounded-[2rem] shadow-kartust md:h-[28rem]"
              >
                <div className={`absolute inset-0 ${k.kadraj || ""}`}>
                  <Image
                    src={k.gorsel}
                    alt={k.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 600px"
                    className={`gorsel-yakinlas object-cover ${k.konum || ""}`}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-camgece via-camgece/45 to-transparent" aria-hidden />
                <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-white/15 transition-colors duration-500 group-hover:border-altinacik/50" aria-hidden />
                <div className="relative flex w-full min-w-0 items-end justify-between gap-4 p-6 sm:gap-6 sm:p-9 md:p-11">
                  <div className="min-w-0">
                    <p className="kicker-acik">{k.kicker}</p>
                    <h2 className="mt-3 text-3xl !text-fildisi md:text-4xl">{k.baslik}</h2>
                    <p className="mt-3 max-w-sm text-fildisi/75">{k.metin}</p>
                  </div>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-altin-gradyan text-camgece shadow-altinhale transition-transform duration-500 ease-yumusak group-hover:rotate-45">
                    <ArrowUpRight className="h-6 w-6" aria-hidden />
                  </span>
                </div>
              </Link>
            </RevealOge>
          ))}
        </RevealGrup>
      </section>

      {/* Öne çıkan programlar */}
      {featured.length > 0 && (
        <section className="site-container pt-24 md:pt-28" aria-labelledby="one-cikan">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <BolumBasligi
              id="one-cikan"
              kicker="Programlarımız"
              baslik="Öne çıkan"
              vurgu="programlar"
              aciklama="Tarih, süre ve konaklama planlarıyla hazırladığımız programlardan bir seçki."
              hizali="sol"
            />
            <Reveal className="flex w-full min-w-0 flex-wrap gap-3 lg:w-auto">
              <Link href="/umre-turlari" className="btn-cerceve !px-5 !py-2.5 text-sm">Umre turları</Link>
              <Link href="/hac-turlari" className="btn-cerceve !px-5 !py-2.5 text-sm">Hac programları</Link>
              <Link href="/kultur-turlari" className="btn-cerceve !px-5 !py-2.5 text-sm">Kültür turları</Link>
              <Link href="/kisiye-ozel-turlar" className="btn-cerceve !px-5 !py-2.5 text-sm">Özel Turlar</Link>
            </Reveal>
          </div>
          <RevealGrup className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3" aralik={0.09}>
            {featured.map((p) => (
              <RevealOge key={p.id} className="flex">
                <PackageCard p={p} />
              </RevealOge>
            ))}
          </RevealGrup>
        </section>
      )}

      {/* Neden biz */}
      <section className="pt-24 md:pt-28" aria-labelledby="neden">
        <div className="site-container">
          <div className="desen-acik relative overflow-hidden rounded-[2rem] border border-cizgi bg-kagit px-6 py-16 shadow-kart sm:px-10 md:px-14 md:py-20">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <BolumBasligi
                  id="neden"
                  kicker="Yaklaşımımız"
                  baslik="Neden"
                  vurgu="Dört Bucak?"
                  aciklama="Kutsal bir yolculukta en önemli şey güvendir. Her adımı açık, düzenli ve ulaşılabilir biçimde planlarız."
                  hizali="sol"
                />
              </div>
              <RevealGrup className="grid gap-5 sm:grid-cols-2 lg:col-span-8" aralik={0.08}>
                {nedenler.map(([Ikon, t, d], i) => (
                  <RevealOge key={t} className="h-full">
                    <div className="group h-full rounded-[1.25rem] border border-cizgi bg-fildisi/60 p-7 transition-all duration-500 ease-yumusak hover:-translate-y-1 hover:border-altinacik/50 hover:bg-kagit hover:shadow-kartust">
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cam text-altinparlak transition-colors duration-500 group-hover:bg-altin-gradyan group-hover:text-camgece">
                          <Ikon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="font-display text-3xl text-cizgi">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="mt-6 text-xl">{t}</h3>
                      <p className="mt-2 text-[0.95rem] text-gri">{d}</p>
                    </div>
                  </RevealOge>
                ))}
              </RevealGrup>
            </div>
          </div>
        </div>
      </section>

      {/* Yolculuk süreci */}
      <section className="site-container pt-24 md:pt-28" aria-labelledby="surec">
        <BolumBasligi
          id="surec"
          kicker="Adım adım"
          baslik="Yolculuk"
          vurgu="süreci"
          aciklama="İlk telefondan dönüş gününe kadar izlediğimiz yol."
        />
        <RevealGrup className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6" aralik={0.1}>
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-altinacik/0 via-altinacik/60 to-altinacik/0 md:block"
            aria-hidden
          />
          {surec.map(([t, d], i) => (
            <RevealOge key={t}>
              <div className="relative text-center">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-altinacik/50 bg-fildisi font-display text-xl text-altin shadow-kart">
                  <span className="absolute inset-1.5 rounded-full bg-cam" aria-hidden />
                  <span className="relative text-altinparlak">{i + 1}</span>
                </span>
                <h3 className="mt-6 text-xl">{t}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-[0.95rem] text-gri">{d}</p>
              </div>
            </RevealOge>
          ))}
        </RevealGrup>
      </section>

      {/* Bilgilendirme + SSS */}
      <section className="site-container grid gap-7 pt-24 md:pt-28 lg:grid-cols-12" aria-labelledby="bilgi">
        <Reveal yon="sol" className="lg:col-span-5">
          <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-cam p-9 text-fildisi shadow-derin md:p-10">
            <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="relative">
              <p className="kicker-acik">Bilgilendirme</p>
              <h2 id="bilgi" className="mt-4 text-3xl !text-fildisi">Hac ve Umre Hakkında</h2>
              <p className="mt-5 leading-relaxed text-fildisi/70">
                Hac, İslam&apos;ın beş şartından biridir ve yılın belirli günlerinde, hac mevsiminde yerine
                getirilir. Umre ise yıl boyunca yapılabilen, Kâbe&apos;yi tavaf ve sa&apos;y ibadetlerini içeren
                bir ziyarettir.
              </p>
              <p className="mt-4 leading-relaxed text-fildisi/70">
                Her iki yolculukta da hazırlık, belgeler ve ibadetlerin yapılışı hakkında ekibimiz size
                adım adım eşlik eder. Vize, pasaport, aşı ve resmî seyahat şartları zaman içinde
                değişebilir; güncel bilgiler kayıt sırasında paylaşılır.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal yon="sag" className="lg:col-span-7">
          <div className="h-full">
            <p className="kicker">Merak edilenler</p>
            <h2 className="mt-4 text-3xl">Sık sorulanlardan</h2>
            <div className="mt-7"><Faq items={sssSecme} /></div>
            <Link href="/sss" className="group mt-6 inline-flex items-center gap-2 font-semibold text-altin">
              Tüm soruları görüntüle
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-yumusak group-hover:translate-x-1.5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* İletişim çağrısı */}
      <section className="site-container pt-24 md:pt-28" aria-labelledby="cagri">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-camgece px-7 py-20 text-center text-fildisi shadow-derin md:py-24">
            <Image src="/images/slider-2-masaustu.webp" alt="" fill sizes="(max-width: 1280px) 100vw, 1200px" className="-z-10 object-cover opacity-35" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-camgece/60 via-camgece/80 to-camgece" aria-hidden />
            <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-altinacik/20" aria-hidden />
            <p className="kicker-acik kicker-orta">İletişim</p>
            <h2 id="cagri" className="baslik-buyuk mx-auto mt-5 max-w-2xl !text-fildisi">
              Size nasıl <span className="altin-yazi italic">yardımcı</span> olabiliriz?
            </h2>
            <p className="olcu mx-auto mt-5 text-fildisi/70">
              Program tarihleri, fiyatlar ve kayıt şartları hakkında bilgi almak için bize ulaşın.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-altin"
              >
                <WaIcon /> WhatsApp&apos;tan Bilgi Al
              </a>
              <a href={telLink()} className="btn-cam-uzeri">
                <Phone className="h-4 w-4" aria-hidden /> {site.phone}
              </a>
            </div>
            <p className="mt-8 text-sm text-fildisi/50">
              {site.address} ·{" "}
              <Link href="/iletisim" className="underline decoration-altinacik/40 underline-offset-4 hover:text-altinparlak">
                Adres ve harita
              </Link>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
