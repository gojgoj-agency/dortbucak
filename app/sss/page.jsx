import Link from "next/link";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import SayfaKapak from "@/components/SayfaKapak";
import { sorular } from "@/lib/faq";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const metadata = sayfaMeta({
  title: "Hac ve Umre Sık Sorulan Sorular",
  description:
    "Hac ve umre hakkında pasaport, fiyat, oda farkı, Ramazan umresi, rehber ve sağlık soruları. Dört Bucak Tur.",
  path: "/sss",
});

export default function Page() {
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
      <SayfaKapak
        kicker="Merak edilenler"
        baslik="Sık Sorulan Sorular"
        aciklama="Pasaport, fiyat, oda farkı, rehber ve yolculuk hazırlığı hakkında en çok sorulanlar."
      />
      <div className="site-container max-w-3xl py-14 md:py-16">
        <Faq items={sorular} />
        <p className="mt-8 text-center text-gri">
          Sorunuzun cevabını bulamadıysanız{" "}
          <Link href="/iletisim" className="font-semibold text-altin hover:underline">
            iletişim sayfasından
          </Link>{" "}
          bize ulaşabilirsiniz.
        </p>
      </div>
    </>
  );
}
