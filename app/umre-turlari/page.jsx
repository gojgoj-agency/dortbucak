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
        kicker="Gönüllere Şifa"
        intro="Size uygun programı listeden inceleyerek bize ulaşın."
      />
    </>
  );
}
