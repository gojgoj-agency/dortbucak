import Link from "next/link";
import { Phone } from "lucide-react";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { WaIcon } from "@/components/SocialLinks";
import { getFaqs } from "@/lib/db";
import { site, telLink, waLink } from "@/lib/site";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "Hac ve Umre Sık Sorulan Sorular",
  description:
    "Hac ve umre hakkında pasaport, fiyat, oda farkı, Ramazan umresi, rehber ve sağlık soruları. Dört Bucak Tur.",
  path: "/sss",
});

const grupTanim = [
  {
    id: "program",
    baslik: "Program ve yolculuk",
    metin: "Süre, rehber, katılım ve organizasyonun nasıl ilerlediği.",
  },
  {
    id: "fiyat",
    baslik: "Fiyat ve konaklama",
    metin: "Pakete dahil olanlar, oda farkı ve ödeme.",
  },
  {
    id: "evrak",
    baslik: "Evrak ve sağlık",
    metin: "Pasaport, vize, hac kaydı ve sağlık şartları.",
  },
];

export const dynamic = "force-dynamic";

export default async function Page() {
  const kayitlar = await getFaqs(true);
  const sorular = kayitlar.map((k) => [k.question, k.answer]);
  const gruplar = grupTanim
    .map((grup) => ({
      ...grup,
      maddeler: kayitlar.filter((k) => k.group_key === grup.id).map((k) => [k.question, k.answer]),
    }))
    .filter((grup) => grup.maddeler.length);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([
        ["Ana Sayfa", "/"],
        ["Sık Sorulan Sorular", "/sss"],
      ]),
      {
        "@type": "FAQPage",
        mainEntity: sorular.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="border-b border-cizgi bg-kagit">
        <div className="site-container py-14 md:py-20">
          <nav aria-label="Sayfa yolu" className="text-xs font-semibold uppercase tracking-[0.18em] text-gri">
            <Link href="/" className="transition-colors hover:text-cam">Ana Sayfa</Link>
            <span className="mx-2 text-altinacik" aria-hidden>/</span>
            <span className="text-altin">Sık Sorulan Sorular</span>
          </nav>
          <p className="kicker mt-8">Kayıttan önce</p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-5xl">Merak edilenler</h1>
          <p className="olcu mt-5 text-lg text-gri">
            Pasaport, fiyat, oda farkı, rehber ve yolculuk hazırlığı hakkında en çok sorulanlar.
            Cevabını burada bulamazsanız ofisimizden sorun.
          </p>
        </div>
      </section>

      <div className="site-container grid gap-12 py-14 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-16 md:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-altin">Konular</p>
          <nav aria-label="Soru konuları" className="mt-4 flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {gruplar.map((grup, i) => (
              <a
                key={grup.id}
                href={`#${grup.id}`}
                className="shrink-0 rounded-full border border-cizgi bg-kagit px-4 py-2 text-sm font-medium text-cam transition-colors hover:border-altinacik lg:rounded-xl lg:px-4 lg:py-3"
              >
                <span className="mr-2 font-display text-altin">{String(i + 1).padStart(2, "0")}</span>
                {grup.baslik}
              </a>
            ))}
          </nav>

          <div className="mt-6 hidden rounded-2xl bg-cam p-5 text-fildisi lg:block">
            <p className="font-display text-xl text-fildisi">Sorunuz listede yok mu?</p>
            <p className="mt-2 text-sm leading-relaxed text-fildisi/70">
              Telefon veya WhatsApp üzerinden sorun, kayıttan önce netleştirelim.
            </p>
            <a href={telLink()} className="mt-4 flex items-center gap-2 text-sm font-semibold text-altinparlak hover:text-white">
              <Phone className="h-4 w-4" aria-hidden /> {site.phone}
            </a>
            <a
              href={waLink("Merhaba, bir sorum var.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-altin mt-4 w-full !px-4 !py-2.5 text-sm"
            >
              <WaIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </aside>

        <div className="space-y-14">
          {gruplar.map((grup) => (
            <section key={grup.id} id={grup.id} className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl">{grup.baslik}</h2>
              <p className="mt-2 text-gri">{grup.metin}</p>
              <div className="mt-6">
                <Faq items={grup.maddeler} />
              </div>
            </section>
          ))}

          <div className="rounded-[1.35rem] border border-cizgi bg-kagit p-6 shadow-kart sm:p-8 lg:hidden">
            <h2 className="text-2xl">Sorunuz listede yok mu?</h2>
            <p className="mt-2 text-gri">Telefon veya WhatsApp üzerinden sorun.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={telLink()} className="btn-cam !px-5 !py-2.5 text-sm">
                <Phone className="h-4 w-4" aria-hidden /> Ara
              </a>
              <a href={waLink("Merhaba, bir sorum var.")} target="_blank" rel="noopener noreferrer" className="btn-altin !px-5 !py-2.5 text-sm">
                <WaIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <p className="text-gri">
            Ofis adresi ve çalışma saatleri için{" "}
            <Link href="/iletisim" className="font-semibold text-altin hover:underline">iletişim sayfasına</Link>{" "}
            bakabilirsiniz.
          </p>
        </div>
      </div>
    </>
  );
}
