import CustomPointForm from "@/components/admin/CustomPointForm";
import PageHead from "@/components/admin/PageHead";
import { saveCustomPointAction } from "../../actions";

export default function Page() {
  return (
    <div>
      <PageHead
        back={{ href: "/admin/kisiye-ozel", label: "Özel Turlar sayfasına dön" }}
        kicker="Yeni kayıt"
        title="Yeni kart"
        description="Kişiye özel turlar sayfasında görünecek kısa maddeyi ekleyin."
      />
      <CustomPointForm action={saveCustomPointAction} />
    </div>
  );
}
