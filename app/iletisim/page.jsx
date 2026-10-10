import { Clock, Mail, MapPin, Phone } from "lucide-react";
import SocialLinks, { WaIcon } from "@/components/SocialLinks";
import JsonLd from "@/components/JsonLd";
import SayfaKapak from "@/components/SayfaKapak";
import { site, waLink, telLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "İletişim",
  description:
    "Dört Bucak Tur iletişim: hac ve umre için telefon, WhatsApp, e-posta ve Keçiören/Ankara adresi.",
  path: "/iletisim",
});

export default function Page() {
  const phone = telLink();
  const kartlar = [
    { ikon: Phone, etiket: "Telefon", deger: site.phone, href: phone },
    { ikon: WaIcon, etiket: "WhatsApp", deger: "WhatsApp ile yazın", href: waLink("Merhaba"), dis: true },
    { ikon: Mail, etiket: "E-posta", deger: site.email, href: `mailto:${site.email}` },
    { ikon: MapPin, etiket: "Adres", deger: site.address, href: site.mapLink, dis: true },
    { ikon: Clock, etiket: "Çalışma", deger: site.hours, href: site.mapLink, dis: true },
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
      <SayfaKapak
        kicker="Keçiören, Ankara"
        baslik="İletişim"
        aciklama="Program tarihleri, fiyatlar ve kayıt için telefon, WhatsApp veya e-posta üzerinden bize ulaşın."
        gorsel="/images/slider-2-masaustu.webp"
      />

      <div className="site-container py-14 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div id="whatsapp" className="doku relative overflow-hidden rounded-[1.75rem] bg-camderin p-6 text-fildisi shadow-derin sm:p-8">
              <div className="relative">
                <p className="kicker-acik">Hemen ulaşın</p>
                <h2 className="mt-2 text-2xl !text-fildisi">Sorularınız için buradayız</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-fildisi/80 sm:text-base">
                  Telefon veya WhatsApp üzerinden tarih, konaklama ve kayıt hakkında bilgi alabilirsiniz.
                </p>
                <a href={phone} className="mt-4 inline-flex font-display text-2xl text-altinacik hover:text-altinparlak">
                  {site.phone}
                </a>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={waLink("Merhaba")} target="_blank" rel="noopener noreferrer" className="btn-wa">
                    <WaIcon /> WhatsApp&apos;tan Bilgi Al
                  </a>
                  <a href={phone} className="btn-cam-uzeri">Telefonla arayın</a>
                </div>
                <SocialLinks tone="footer" className="mt-6" />
              </div>
            </div>

            <ul className="grid gap-3">
              {kartlar.map(({ ikon: Ikon, etiket, deger, href, dis }) => (
                <li key={etiket}>
                  <a
                    href={href}
                    target={dis ? "_blank" : undefined}
                    rel={dis ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 rounded-2xl border border-cizgi bg-kagit px-5 py-4 shadow-kart transition-colors hover:border-altin/40"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cam text-altinacik">
                      <Ikon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-altin">{etiket}</span>
                      <span className="mt-0.5 block break-words text-cam">{deger}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-cizgi bg-kagit shadow-kartust lg:sticky lg:top-36 lg:self-start">
            <iframe
              title="Dört Bucak Tur konumu"
              src={site.mapEmbed}
              className="aspect-[16/10] w-full border-0 sm:aspect-[4/3] lg:aspect-auto lg:h-[36rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
  );
}
