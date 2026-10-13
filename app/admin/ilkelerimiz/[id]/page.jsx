import { notFound } from "next/navigation";
import PrincipleForm from "@/components/admin/PrincipleForm";
import PageHead from "@/components/admin/PageHead";
import { getPrincipleById } from "@/lib/db";
import { savePrincipleAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const kayit = await getPrincipleById(Number(params.id));
  if (!kayit) notFound();
  return (
    <div>
      <PageHead
        back={{ href: "/admin/ilkelerimiz", label: "İlke listesine dön" }}
        kicker="Düzenle"
        title={kayit.title}
        description="Kayıt, İlkelerimiz sayfasını hemen günceller."
      />
      <PrincipleForm kayit={kayit} action={savePrincipleAction} />
    </div>
  );
}
