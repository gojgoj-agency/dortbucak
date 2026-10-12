import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenText, HeartHandshake, MapPin, MessagesSquare } from "lucide-react";
import SayfaKapak from "@/components/SayfaKapak";
import JsonLd from "@/components/JsonLd";
import Reveal, { RevealGrup, RevealOge } from "@/components/Reveal";
import { WaIcon } from "@/components/SocialLinks";
import { site, telLink, waLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "Hakkımızda",
  description:
    "Keçiören, Ankara merkezli Dört Bucak Tur rehberli hac ve umre programları düzenler. 14 günlük umre fiyatları ve kayıt için bize ulaşın.",
  path: "/hakkimizda",
});

const ilkeler = [
  [HeartHandshake, "Rehberli yolculuk", "Programlarımızda din görevlisi ve rehber eşliğinde hareket edilir; ibadetler topluca ve usulüne uygun biçimde yerine getirilir."],
  [BookOpenText, "Açık bilgilendirme", "Dahil olan ve olmayan hizmetleri açıkça yazar, yolculuk öncesinde belgeler ve programın işleyişi hakkında adım adım bilgi veririz."],
  [MessagesSquare, "Ulaşılabilir ekip", "Sorulara net cevap vermeyi ilke ediniriz. Merak ettiğiniz her konuda telefon veya WhatsApp üzerinden bize ulaşabilirsiniz."],
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["Hakkımızda", "/hakkimizda"],
          ]),
        }}
      />

      <SayfaKapak
        kicker="Keçiören, Ankara"
        baslik="Hakkımızda"
        aciklama="Kutsal topraklara giden yolu huzurlu, düzenli ve doğru bilgiyle yürüyebilmeniz için yanınızdayız."
      />

      <section className="site-container py-24 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal yon="sol">
            <div className="relative mx-auto max-w-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-derin">
                <Image
                  src="/images/paket-umre-2.webp"
                  alt="Kutsal topraklardan bir görünüm"
                  fill
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-[2rem] border border-altinacik/50" aria-hidden />
              <div className="absolute -bottom-6 left-6 rounded-2xl border border-cizgi bg-kagit px-6 py-4 shadow-kartust">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-altin">Ofisimiz</p>
                <p className="mt-1 font-display text-xl text-cam">Keçiören, Ankara</p>
              </div>
            </div>
          </Reveal>
          <Reveal yon="sag">
            <p className="kicker">Biz kimiz</p>
            <h2 className="baslik-buyuk mt-5">
              Ankara merkezli bir <span className="italic text-altin">hac ve umre</span> organizasyonu
            </h2>
            <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-gri">
              <p>
                Dört Bucak Tur, Ankara Keçiören’de hac ve umre organizasyonu yapan bir seyahat acentesidir.
                Amacımız, misafirlerimizin kutsal topraklara yapacakları yolculuğu huzur içinde, doğru
                bilgiyle ve düzenli bir programla gerçekleştirmelerine yardımcı olmaktır.
              </p>
              <p>
                Programlarımızda din görevlisi ve rehber eşliğinde hareket edilir; ibadetler topluca ve
                usulüne uygun biçimde yerine getirilir. Yolculuk öncesinde gerekli belgeler, hazırlıklar
                ve programın işleyişi hakkında misafirlerimizi adım adım bilgilendiririz.
              </p>
              <p>
                Dahil olan ve olmayan hizmetleri açıkça yazmayı, sorulara net cevap vermeyi ve
                ulaşılabilir olmayı ilke ediniyoruz.
              </p>
            </div>
            <p className="mt-6 inline-flex items-start gap-2.5 text-sm text-cam">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-altin" aria-hidden />
              <span>{site.address}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="doku relative overflow-hidden bg-camgece py-24 text-fildisi md:py-28" aria-labelledby="ilkeler">
        <div className="desen pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div className="site-container relative">
          <Reveal className="text-center">
            <p className="kicker-acik kicker-orta">İlkelerimiz</p>
            <h2 id="ilkeler" className="baslik-buyuk mt-5 !text-fildisi">
              Yolculuğu <span className="altin-yazi italic">nasıl</span> hazırlıyoruz
            </h2>
          </Reveal>
          <RevealGrup className="mt-14 grid gap-6 md:grid-cols-3">
            {ilkeler.map(([Ikon, baslik, metin], i) => (
              <RevealOge key={baslik} className="h-full">
                <article className="kart-koyu group h-full p-8 hover:-translate-y-1 hover:border-altinacik/40">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-altinacik/35 bg-altinacik/10 text-altinacik transition-colors duration-500 group-hover:bg-altinacik group-hover:text-camgece">
                      <Ikon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-display text-3xl text-white/10">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 text-xl !text-fildisi">{baslik}</h3>
                  <p className="mt-2 text-fildisi/60">{metin}</p>
                </article>
              </RevealOge>
            ))}
          </RevealGrup>
        </div>
      </section>

      <section className="site-container pt-24 md:pt-28">
        <Reveal>
          <div className="rounded-[1.25rem] border border-altinacik/50 bg-kagit px-6 py-7 shadow-kart sm:px-9">
            <p className="kicker">Önemli not</p>
            <p className="mt-3 max-w-3xl text-murekkep">
              Vize, pasaport, aşı ve resmî seyahat şartları zaman içinde değişebilir. Güncel şartlar,
              kayıt sırasında tarafınıza yazılı olarak bildirilir.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-cam px-6 py-14 text-center text-fildisi shadow-derin sm:px-10 sm:py-20">
            <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-altinacik/20" aria-hidden />
            <div className="relative">
              <p className="kicker-acik kicker-orta">Programlar</p>
              <h2 className="baslik-buyuk mt-5 !text-fildisi">
                Hac ve umre <span className="altin-yazi italic">programlarımız</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-fildisi/80">
                Tarih, süre ve konaklama planlarını inceleyin; aklınıza takılan her şeyi bize sorun.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/umre-turlari" className="btn-cam-uzeri">
                  Umre turları
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/hac-turlari" className="btn-cam-uzeri">
                  Hac turları
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a
                  href={waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-altin"
                >
                  <WaIcon /> WhatsApp
                </a>
                <a href={telLink()} className="btn-cam-uzeri">
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
