import PackageListPage from "@/components/PackageListPage";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = sayfaMeta({
  title: "Umre Turları",
  description:
    "Ankara umre turları: 14 günlük umre programı, dönem fiyatları ve Mekke–Medine konaklama. Kayıt için Dört Bucak Tur.",
  path: "/umre-turlari",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["Umre Turları", "/umre-turlari"],
          ]),
        }}
      />
      <PackageListPage
        category="umre"
        title="Umre Turları"
        intro="14 günlük umre programlarımızın dönem fiyatları 4 kişilik odada kişi başıdır. 3 ve 2 kişilik odalarda 75 dolar, Ramazan umrelerinde 100 dolar eklenir. Size uygun dönemi birlikte belirlemek için bize ulaşın."
      />
    </>
  );
}
