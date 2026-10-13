import PrincipleForm from "@/components/admin/PrincipleForm";
import PageHead from "@/components/admin/PageHead";
import { savePrincipleAction } from "../../actions";

export default function Page() {
  return (
    <div>
      <PageHead
        back={{ href: "/admin/ilkelerimiz", label: "İlke listesine dön" }}
        kicker="Yeni kayıt"
        title="Yeni ilke"
        description="İlkelerimiz sayfasında görünecek başlık ve metni ekleyin."
      />
      <PrincipleForm action={savePrincipleAction} />
    </div>
  );
}
