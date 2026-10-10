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

      <section className="site-container py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal yon="sol">
            <div className="kemer relative mx-auto aspect-[4/5] w-full max-w-md shadow-derin">
              <Image
                src="/images/paket-umre-2.webp"
                alt="Kutsal topraklardan bir görünüm"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal yon="sag">
            <p className="kicker">Biz kimiz</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Ankara merkezli bir hac ve umre organizasyonu</h2>
            <div className="baslik-cizgi !mx-0" />
            <div className="mt-6 space-y-4 text-gri">
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

      <section className="bg-kagit py-16 md:py-20" aria-labelledby="ilkeler">
        <div className="site-container">
          <Reveal className="text-center">
            <p className="kicker">İlkelerimiz</p>
            <h2 id="ilkeler" className="mt-3 text-3xl md:text-4xl">Yolculuğu nasıl hazırlıyoruz</h2>
            <div className="baslik-cizgi" />
          </Reveal>
          <RevealGrup className="mt-12 grid gap-6 md:grid-cols-3">
            {ilkeler.map(([Ikon, baslik, metin]) => (
              <RevealOge key={baslik}>
                <article className="h-full rounded-2xl border border-cizgi bg-fildisi p-7 shadow-kart">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-altin/30 bg-altin/10 text-altin">
                    <Ikon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl">{baslik}</h3>
                  <p className="mt-2 text-gri">{metin}</p>
                </article>
              </RevealOge>
            ))}
          </RevealGrup>
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
        <Reveal>
          <div className="rounded-2xl border border-altin/30 bg-altin/10 px-6 py-7 sm:px-8">
            <p className="kicker">Önemli not</p>
            <p className="mt-3 max-w-3xl text-murekkep">
              Vize, pasaport, aşı ve resmî seyahat şartları zaman içinde değişebilir. Güncel şartlar,
              kayıt sırasında tarafınıza yazılı olarak bildirilir.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="doku relative overflow-hidden rounded-[1.75rem] bg-camderin px-6 py-12 text-center text-fildisi shadow-derin ring-1 ring-altinacik/20 sm:px-10 sm:py-16">
            <div className="relative">
              <p className="kicker-acik">Programlar</p>
              <h2 className="mt-3 text-2xl !text-fildisi md:text-3xl">Hac ve umre programlarımıza göz atın</h2>
              <div className="baslik-cizgi" />
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
                  className="btn-wa"
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
