import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, Headphones, Heart, Users } from "lucide-react";
import SayfaKapak from "@/components/SayfaKapak";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { WaIcon } from "@/components/SocialLinks";
import { getPrinciples } from "@/lib/db";
import { site, telLink, waLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "İlkelerimiz",
  description:
    "Dört Bucak Tur ilkeleri: manevi hassasiyet, doğru rehberlik, titiz organizasyon, kesintisiz destek ve misafir memnuniyeti.",
  path: "/ilkelerimiz",
});

const ikonlar = { Heart, BookOpen, ClipboardCheck, Headphones, Users };

export const dynamic = "force-dynamic";

export default async function Page() {
  const ilkeler = await getPrinciples(true);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["İlkelerimiz", "/ilkelerimiz"],
          ]),
        }}
      />

      <SayfaKapak
        kicker="Ankara"
        baslik="İlkelerimiz"
        aciklama="Yolculuğu nasıl hazırladığımızı, hangi sözlerle ilerlediğimizi burada topladık."
      />

      <section className="site-container py-16 md:py-24" aria-labelledby="ilkeler">
        <h2 id="ilkeler" className="sr-only">
          İlkelerimiz
        </h2>
        <Reveal>
          <ul className="mx-auto max-w-3xl divide-y divide-cizgi overflow-hidden rounded-[1.5rem] border border-cizgi bg-kagit shadow-kart">
            {ilkeler.map((p) => {
              const Ikon = ikonlar[p.icon] || Heart;
              return (
              <li key={p.id} className="flex items-start gap-5 px-6 py-6 sm:gap-6 sm:px-8 sm:py-7">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cam/[0.06] text-camacik">
                  <Ikon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-sans text-[1.15rem] font-semibold leading-snug text-murekkep">{p.title}</h3>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed text-gri">{p.body}</p>
                </div>
              </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      <section className="site-container pt-24 md:pt-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-cam px-6 py-14 text-center text-fildisi shadow-derin sm:px-10 sm:py-20">
            <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-altinacik/20" aria-hidden />
            <div className="relative">
              <p className="kicker-acik kicker-orta">Bir sonraki adım</p>
              <h2 className="baslik-buyuk mt-5 !text-fildisi">
                Programı birlikte <span className="altin-yazi italic">netleştirelim</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-fildisi/80">
                Tarih, süre ve konaklama planlarını inceleyin; aklınıza takılan her şeyi bize sorun.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/umre-turlari" className="btn-cam-uzeri">
                  Umre turları
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/hakkimizda" className="btn-cam-uzeri">
                  Hakkımızda
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
