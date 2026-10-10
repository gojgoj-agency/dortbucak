import PackageForm from "@/components/admin/PackageForm";
import PageHead from "@/components/admin/PageHead";
import { savePackageAction } from "../../actions";

export default function Page() {
  return (
    <div>
      <PageHead
        back={{ href: "/admin/paketler", label: "Paketlere dön" }}
        kicker="Yeni kayıt"
        title="Yeni paket"
        description="Tarih, fiyat ve program detaylarını girin. Yayını kapatırsanız paket sitede görünmez."
      />
      <PackageForm action={savePackageAction} />
    </div>
  );
}
