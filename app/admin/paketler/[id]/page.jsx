import { notFound } from "next/navigation";
import PackageForm from "@/components/admin/PackageForm";
import PageHead from "@/components/admin/PageHead";
import { getPackageById } from "@/lib/db";
import { savePackageAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const pkg = await getPackageById(Number(params.id));
  if (!pkg) notFound();
  return (
    <div>
      <PageHead
        back={{ href: "/admin/paketler", label: "Paketlere dön" }}
        kicker="Düzenle"
        title={pkg.name}
        description="Kayıt, sitedeki paket sayfasını ve listeleri hemen günceller."
      />
      <PackageForm pkg={pkg} action={savePackageAction} />
    </div>
  );
}
