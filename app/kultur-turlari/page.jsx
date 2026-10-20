import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Landmark, MapPin, Mountain, Phone } from "lucide-react";
import SayfaKapak from "@/components/SayfaKapak";
import PackageCard from "@/components/PackageCard";
import JsonLd from "@/components/JsonLd";
import Reveal, { RevealGrup, RevealOge } from "@/components/Reveal";
import { WaIcon } from "@/components/SocialLinks";
import { getPackages } from "@/lib/db";
import { site, telLink, waLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = sayfaMeta({
  title: "Kültür Turları",
  description:
    "Dört Bucak Tur kültür turları: tarihe ve doğaya yolculuk. Tarihi keşif, doğa ile iç içe rotalar, kültürel deneyim ve eşsiz güzergâhlar.",
  path: "/kultur-turlari",
  images: ["/images/kultur.jpg"],
});

const basliklar = [
  [Landmark, "Tarihi Keşif", "Kentleri, camileri ve eski sokakları yerinde görün; her durak bir dönemin izini taşır."],
  [Mountain, "Doğa ile İç İçe", "Vadiler, göller ve açık hava rotalarında doğayla iç içe bir yolculuk."],
  [Camera, "Kültürel Deneyim", "Yerel yaşam, lezzetler ve geleneklerle zenginleşen programlar."],
  [MapPin, "Eşsiz Rotalar", "Her dönem farklı şehir ve doğa duraklarıyla hazırlanan güzergâhlar."],
];

export default async function Page() {
  const paketler = await getPackages({ category: "kultur" });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["Kültür Turları", "/kultur-turlari"],
          ]),
        }}
      />

      <SayfaKapak
        kicker="Tarihe ve Doğaya Yolculuk"
        baslik="Kültür"
        vurgu="Turları"
        aciklama="Tarihi keşif, doğayla iç içe duraklar, kültürel deneyim ve eşsiz rotalar. Programı birlikte seçmek için bize ulaşın."
        gorsel="/images/kultur.jpg"
      />

      <section className="site-container py-24 md:py-28" aria-labelledby="kultur-basliklar">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal yon="sol">
            <div className="relative">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-derin">
                <Image
                  src="/images/kultur.jpg"
                  alt="Kültür turları: tarihe ve doğaya yolculuk"
                  fill
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-[2rem] border border-altinacik/50" aria-hidden />
            </div>
          </Reveal>
          <Reveal yon="sag">
            <p className="kicker">Kültür turları</p>
            <h2 id="kultur-basliklar" className="baslik-buyuk mt-5">
              Tarihe ve doğaya <span className="italic text-altin">yolculuk</span>
            </h2>
            <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-gri">
              <p>
                Kültür turlarımız, Anadolu’nun kentlerini, tarihi dokusunu ve doğasını aynı programda
                buluşturur. Rehber eşliğinde ilerler; her durakta ne göreceğinizi ve günün akışını önceden
                bilirsiniz.
              </p>
              <p>
                Tarihi keşif, doğa ile iç içe rotalar, kültürel deneyim ve eşsiz güzergâhlar bu yolculuğun
                dört ayağıdır. Tarih, kontenjan ve konaklama için güncel bilgiyi kayıt öncesinde paylaşırız.
              </p>
            </div>
            <p className="mt-6 text-sm font-medium text-cam">{site.slogan}</p>
          </Reveal>
        </div>

        <RevealGrup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aralik={0.08}>
          {basliklar.map(([Ikon, baslik, metin]) => (
            <RevealOge key={baslik} className="h-full">
              <article className="group h-full rounded-[1.25rem] border border-cizgi bg-kagit p-7 shadow-kart transition-all duration-500 ease-yumusak hover:-translate-y-1 hover:border-altinacik/50 hover:shadow-kartust">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cam text-altinparlak transition-colors duration-500 group-hover:bg-altin-gradyan group-hover:text-camgece">
                  <Ikon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl">{baslik}</h3>
                <p className="mt-2 text-[0.95rem] text-gri">{metin}</p>
              </article>
            </RevealOge>
          ))}
        </RevealGrup>
      </section>

      {paketler.length > 0 && (
        <section className="site-container pb-4" aria-labelledby="kultur-programlar">
          <Reveal>
            <p className="kicker">Programlar</p>
            <h2 id="kultur-programlar" className="mt-4 text-3xl">Yayındaki kültür turları</h2>
          </Reveal>
          <RevealGrup className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3" aralik={0.09}>
            {paketler.map((p) => (
              <RevealOge key={p.id} className="flex">
                <PackageCard p={p} />
              </RevealOge>
            ))}
          </RevealGrup>
        </section>
      )}

      <section className="site-container pb-8 pt-8 md:pt-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-cam px-6 py-14 text-center text-fildisi shadow-derin sm:px-10 sm:py-20">
            <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-altinacik/20" aria-hidden />
            <div className="relative">
              <p className="kicker-acik kicker-orta">Kayıt</p>
              <h2 className="baslik-buyuk mt-5 !text-fildisi">
                Size uygun rotayı <span className="altin-yazi italic">birlikte</span> seçelim
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-fildisi/80">
                Tarih, süre ve konaklama için güncel bilgiyi paylaşalım.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={waLink("Merhaba, kültür turlarınız hakkında bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-altin"
                >
                  <WaIcon /> WhatsApp
                </a>
                <a href={telLink()} className="btn-cam-uzeri">
                  <Phone className="h-4 w-4" aria-hidden /> {site.phone}
                </a>
                <Link href="/iletisim" className="btn-cam-uzeri">
                  İletişim
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
