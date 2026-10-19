import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import SayfaKapak from "@/components/SayfaKapak";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { WaIcon } from "@/components/SocialLinks";
import { site, telLink, waLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "Hakkımızda",
  description:
    "Dört Bucak Tur; hac, umre ve kültür turlarında güveni, manevi hassasiyeti ve titiz organizasyonu esas alır.",
  path: "/hakkimizda",
});

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
        kicker="BİZİ TANIYIN"
        baslik="Hakkımızda"
        aciklama="Yolculuklarınızı huzurla, doğru bilgiyle ve güven içinde gerçekleştirmeniz için yanınızdayız."
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
                <p className="mt-1 font-display text-xl text-cam">Ankara</p>
              </div>
            </div>
          </Reveal>
          <Reveal yon="sag">
            <p className="kicker">Biz kimiz</p>
            <h2 className="baslik-buyuk mt-5">
              Hac, umre ve kültür turlarında <span className="italic text-altin">güven ve özen</span>
            </h2>
            <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-gri">
              <p>
                Dört Bucak Tur olarak Hac, Umre ve Kültür Turları alanında; güveni, manevi hassasiyeti ve titiz organizasyonu esas alıyoruz.
              </p>
              <p>
                Misafirlerimizin yolculuklarını huzurla, doğru bilgiyle ve güven içinde gerçekleştirmelerini amaçlıyoruz.
              </p>
              <p>
                80’den fazla ziyaret noktasıyla Siyer tadında Umre programlarımızda kutsal toprakların tarihini ve manevi atmosferini yakından tanıma imkânı sunuyor; kültür turlarımızla tarihî ve kültürel mirasımızı keşfetmeye davet ediyoruz.
              </p>
              <p>
                Yolculuğun her aşamasında misafirlerimizin yanında oluyor, her ayrıntıyı özenle planlıyoruz. Çünkü bizim için her misafir bir müşteri değil, bir emanettir.{" "}
                <Link href="/ilkelerimiz" className="font-semibold text-cam underline decoration-altinacik/70 underline-offset-4 hover:text-altin">
                  İlkelerimizi inceleyin
                </Link>
                .
              </p>
            </div>
            <p className="mt-6 inline-flex items-start gap-2.5 text-sm text-cam">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-altin" aria-hidden />
              <span>{site.address}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cam text-fildisi" aria-labelledby="davet-baslik">
        <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-kirmizi/70 to-transparent" aria-hidden />
        <div className="site-container relative py-16 md:py-24">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="kicker-acik kicker-orta">Davet</p>
              <h2 id="davet-baslik" className="baslik-buyuk mx-auto mt-5 max-w-3xl !text-fildisi">
                Her yolculuk bir iz, <span className="italic">her ziyaret bir anlam.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fildisi/80">
                Siyer tadında Umre programları, 80’den fazla ziyaret noktası ve özenle planlanan kültür
                turlarıyla anlamlı yolculuklara davetlisiniz.
              </p>
            </div>
          </Reveal>
          <Reveal gecikme={0.12} className="mt-12">
            <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                ["Siyer tadında", "Umre programları"],
                ["80’den fazla", "ziyaret noktası"],
                ["Özenle planlanan", "kültür turları"],
              ].map(([ust, alt]) => (
                <li
                  key={ust}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-6 text-center backdrop-blur-sm"
                >
                  <p className="font-display text-xl leading-snug text-fildisi">{ust}</p>
                  <p className="mt-1.5 text-sm text-fildisi/65">{alt}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
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
                Hac, umre ve kültür <span className="altin-yazi italic">programlarımız</span>
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
                  Hac programları
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/kultur-turlari" className="btn-cam-uzeri">
                  Kültür turları
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/kisiye-ozel-turlar" className="btn-cam-uzeri">
                  Özel Turlar
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
