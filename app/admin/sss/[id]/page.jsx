import { notFound } from "next/navigation";
import FaqForm from "@/components/admin/FaqForm";
import PageHead from "@/components/admin/PageHead";
import { getFaqById } from "@/lib/db";
import { saveFaqAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const kayit = await getFaqById(Number(params.id));
  if (!kayit) notFound();
  return (
    <div>
      <PageHead
        back={{ href: "/admin/sss", label: "Soru listesine dön" }}
        kicker="Düzenle"
        title={kayit.question}
        description="Kayıt, SSS sayfasını hemen günceller."
      />
      <FaqForm kayit={kayit} action={saveFaqAction} />
    </div>
  );
}
