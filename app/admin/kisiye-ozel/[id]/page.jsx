import { notFound } from "next/navigation";
import CustomPointForm from "@/components/admin/CustomPointForm";
import PageHead from "@/components/admin/PageHead";
import { getCustomPointById } from "@/lib/db";
import { saveCustomPointAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const kayit = await getCustomPointById(Number(params.id));
  if (!kayit) notFound();
  return (
    <div>
      <PageHead
        back={{ href: "/admin/kisiye-ozel", label: "Kişiye özel sayfasına dön" }}
        kicker="Düzenle"
        title={kayit.title}
        description="Kayıt, kişiye özel turlar sayfasını hemen günceller."
      />
      <CustomPointForm kayit={kayit} action={saveCustomPointAction} />
    </div>
  );
}
