import FaqForm from "@/components/admin/FaqForm";
import PageHead from "@/components/admin/PageHead";
import { saveFaqAction } from "../../actions";

export default function Page() {
  return (
    <div>
      <PageHead
        back={{ href: "/admin/sss", label: "Soru listesine dön" }}
        kicker="Yeni kayıt"
        title="Yeni soru"
        description="SSS sayfasında ve isterseniz ana sayfada görünecek soruyu ekleyin."
      />
      <FaqForm action={saveFaqAction} />
    </div>
  );
}
