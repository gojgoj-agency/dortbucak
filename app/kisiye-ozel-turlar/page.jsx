import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarRange, Compass, Heart, Hotel, MapPin, Phone, Route, Users } from "lucide-react";
import SayfaKapak from "@/components/SayfaKapak";
import JsonLd from "@/components/JsonLd";
import Reveal, { RevealGrup, RevealOge } from "@/components/Reveal";
import { WaIcon } from "@/components/SocialLinks";
import { getCustomPage, getCustomPoints } from "@/lib/db";
import { site, telLink, waLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "Kişiye Özel Turlar",
  description:
    "Dört Bucak Tur kişiye özel turlar: tarih, süre, grup ve güzergâh birlikte belirlenir. Ankara ofisinden hac, umre veya kültür programı için bize ulaşın.",
  path: "/kisiye-ozel-turlar",
});

const ikonlar = { CalendarRange, Users, Route, Hotel, Compass, MapPin, Heart, Phone };
const varsayilanKapak = "/images/slider-2-masaustu.webp";
const varsayilanYan = "/images/paket-umre-3.webp";
const wa = waLink("Merhaba, kişiye özel bir tur planlamak istiyorum.");

export const dynamic = "force-dynamic";

export default async function Page() {
  const sayfa = await getCustomPage();
  const kartlar = await getCustomPoints(true);
  const kapak = sayfa.cover_image || varsayilanKapak;
  const yan = sayfa.side_image || varsayilanYan;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["Kişiye Özel Turlar", "/kisiye-ozel-turlar"],
          ]),
        }}
      />

      <SayfaKapak
        kicker="Size göre"
        baslik="Kişiye özel"
        vurgu="turlar"
        aciklama={sayfa.lead || "Hazır bir tarih listesine bağlı kalmadan; süre, grup ve güzergâhı birlikte kurduğumuz programlar."}
        gorsel={kapak}
      />

      <section className="site-container py-24 md:py-28" aria-labelledby="ozel-baslik">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal yon="sol">
            <div className="relative mx-auto max-w-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-derin">
                <Image
                  src={yan}
                  alt="Kişiye özel tur planından bir görünüm"
                  fill
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-[2rem] border border-altinacik/50" aria-hidden />
            </div>
          </Reveal>
          <Reveal yon="sag">
            <p className="kicker">Kişiye özel</p>
            <h2 id="ozel-baslik" className="baslik-buyuk mt-5">
              Programı <span className="italic text-altin">birlikte</span> kuralım
            </h2>
            <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-gri">
              <p>
                {sayfa.body_1 || "Kişiye özel turlarda çıkış günü, süre ve duraklar sizin takviminize göre belirlenir. Aile, arkadaş grubu veya kurum için ayrı bir program hazırlarız; dahil olan ve olmayan hizmetleri kayıttan önce yazılı olarak paylaşırız."}
              </p>
              {sayfa.body_2 ? <p>{sayfa.body_2}</p> : (
                <p>
                  Rota hac, umre ya da kültür duraklarından kurulabilir. Hazır programlarımızı da
                  inceleyebilir, size uyan tarihi birlikte seçebilirsiniz.
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/umre-turlari" className="btn-cerceve !px-5 !py-2.5 text-sm">Umre</Link>
              <Link href="/hac-turlari" className="btn-cerceve !px-5 !py-2.5 text-sm">Hac</Link>
              <Link href="/kultur-turlari" className="btn-cerceve !px-5 !py-2.5 text-sm">Kültür</Link>
            </div>
          </Reveal>
        </div>

        <RevealGrup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aralik={0.08}>
          {kartlar.map((kart) => {
            const Ikon = ikonlar[kart.icon] || CalendarRange;
            return (
            <RevealOge key={kart.id} className="h-full">
              <article className="group h-full rounded-[1.25rem] border border-cizgi bg-kagit p-7 shadow-kart transition-all duration-500 ease-yumusak hover:-translate-y-1 hover:border-altinacik/50 hover:shadow-kartust">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cam text-altinparlak transition-colors duration-500 group-hover:bg-altin-gradyan group-hover:text-camgece">
                  <Ikon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl">{kart.title}</h3>
                <p className="mt-2 text-[0.95rem] text-gri">{kart.body}</p>
              </article>
            </RevealOge>
            );
          })}
        </RevealGrup>
      </section>

      <section className="site-container pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-cam px-6 py-14 text-center text-fildisi shadow-derin sm:px-10 sm:py-20">
            <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-altinacik/20" aria-hidden />
            <div className="relative">
              <p className="kicker-acik kicker-orta">Planlama</p>
              <h2 className="baslik-buyuk mt-5 !text-fildisi">
                Size uygun programı <span className="altin-yazi italic">konuşalım</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-fildisi/80">
                Tarih, kişi sayısı ve gitmek istediğiniz yerleri yazın; size uygun seçenekleri birlikte netleştirelim.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-altin">
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
