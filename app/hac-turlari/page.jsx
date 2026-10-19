import PackageListPage from "@/components/PackageListPage";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, sayfaMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = sayfaMeta({
  title: "Hac Programları",
  description:
    "Ankara organizasyonlu hac programları: hac paketi ve Mekke–Medine konaklama. Güncel hac kaydı için Dört Bucak Tur.",
  path: "/hac-turlari",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...breadcrumbLd([
            ["Ana Sayfa", "/"],
            ["Hac Programları", "/hac-turlari"],
          ]),
        }}
      />
      <PackageListPage
        category="hac"
        title="Hac Programları"
        kicker="Huzur'a Davet"
        intro="Hac programlarında Mekke ve Medine konaklamasını, tarihleri ve kayıt şartlarını inceleyebilirsiniz.."
      />
    </>
  );
}
