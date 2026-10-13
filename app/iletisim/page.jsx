import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import SocialLinks, { WaIcon } from "@/components/SocialLinks";
import JsonLd from "@/components/JsonLd";
import { site, waLink, telLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "İletişim",
  description:
    "Dört Bucak Tur iletişim: hac ve umre için telefon, WhatsApp, e-posta ve Ankara adresi.",
  path: "/iletisim",
});

export default function Page() {
  const phone = telLink();
  const { street, postalCode, locality, region } = site.addressParts;
  const kanallar = [
    {
      ikon: Phone,
      etiket: "Telefon",
      baslik: site.phone,
      metin: "Program, kontenjan ve kayıt için arayın.",
      href: phone,
      eylem: "Hemen ara",
    },
    {
      ikon: WaIcon,
      etiket: "WhatsApp",
      baslik: "Mesaj bırakın",
      metin: "Tarih ve oda tercihinizi yazın, size dönüş yapalım.",
      href: waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum."),
      eylem: "WhatsApp’tan yaz",
      dis: true,
    },
    {
      ikon: Mail,
      etiket: "E-posta",
      baslik: site.email,
      metin: "Evrak ve yazılı bilgilendirme için.",
      href: `mailto:${site.email}`,
      eylem: "E-posta gönder",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["İletişim", "/iletisim"],
          ]),
        }}
      />

      <section className="border-b border-cizgi bg-kagit">
        <div className="site-container py-14 md:py-20">
          <nav aria-label="Sayfa yolu" className="text-xs font-semibold uppercase tracking-[0.18em] text-gri">
            <Link href="/" className="transition-colors hover:text-cam">Ana Sayfa</Link>
            <span className="mx-2 text-altinacik" aria-hidden>/</span>
            <span className="text-altin">İletişim</span>
          </nav>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <p className="kicker">Ankara ofisi</p>
              <h1 className="mt-4 text-4xl md:text-5xl">Bize ulaşın</h1>
              <p className="olcu mt-5 text-lg text-gri">
                Hac ve umre programları, tarih ve kayıt için ofisimizden veya telefonla
                görüşebilirsiniz. Sorularınızı kayıttan önce yanıtlarız.
              </p>
            </div>
            <p className="rounded-2xl border border-cizgi bg-fildisi px-5 py-4 text-sm leading-relaxed text-cam">
              <Clock className="mb-2 h-4 w-4 text-altin" aria-hidden />
              {site.hours}
            </p>
          </div>
        </div>
      </section>

      <div className="site-container py-14 md:py-16">
        <ul className="grid gap-4 md:grid-cols-3">
          {kanallar.map(({ ikon: Ikon, etiket, baslik, metin, href, eylem, dis }) => (
            <li key={etiket}>
              <a
                href={href}
                target={dis ? "_blank" : undefined}
                rel={dis ? "noopener noreferrer" : undefined}
                className="group flex h-full flex-col rounded-[1.35rem] border border-cizgi bg-kagit p-6 shadow-kart transition-all duration-300 hover:-translate-y-1 hover:border-altinacik/70 hover:shadow-kartust"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cam text-altinparlak transition-colors duration-300 group-hover:bg-altin-gradyan group-hover:text-camgece">
                  <Ikon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-altin">{etiket}</span>
                <span className="mt-2 break-words font-display text-2xl leading-tight text-cam">{baslik}</span>
                <span className="mt-3 text-sm leading-relaxed text-gri">{metin}</span>
                <span className="mt-6 text-sm font-semibold text-cam">{eylem}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <address className="not-italic rounded-[1.35rem] border border-cizgi bg-kagit p-7 shadow-kart sm:p-9">
            <p className="kicker">Ofis</p>
            <h2 className="mt-4 text-3xl">Sizi ofisimizde de ağırlarız</h2>
            <p className="mt-5 flex items-start gap-3 text-cam">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-altin" aria-hidden />
              <span>
                <span className="block text-lg leading-snug">{street}</span>
                <span className="mt-1 block text-gri">{postalCode} {locality} / {region}</span>
              </span>
            </p>
            <a
              href={site.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex text-sm font-semibold text-altin hover:underline"
            >
              Yol tarifi al
            </a>
            <div className="mt-8 border-t border-cizgi pt-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-altin">Sosyal hesaplar</p>
              <SocialLinks tone="light" className="mt-4" />
            </div>
          </address>

          <div className="overflow-hidden rounded-[1.35rem] border border-cizgi bg-kagit shadow-kart">
            <iframe
              title="Dört Bucak Tur konumu"
              src={site.mapEmbed}
              className="h-72 w-full border-0 sm:h-80 lg:h-full lg:min-h-[26rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <p className="mt-8 rounded-2xl border border-altinacik/40 bg-altin/[0.06] px-6 py-5 text-sm leading-relaxed text-cam">
          Vize, pasaport, aşı ve resmî seyahat şartları değişebilir. Güncel şartlar kayıt sırasında
          yazılı olarak bildirilir.{" "}
          <Link href="/sss" className="font-semibold text-altin hover:underline">
            Sık sorulan sorulara bakın
          </Link>
        </p>
      </div>
    </>
  );
}
