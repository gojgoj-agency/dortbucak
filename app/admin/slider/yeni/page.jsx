import SliderForm from "@/components/admin/SliderForm";
import PageHead from "@/components/admin/PageHead";
import { saveSliderAction } from "../../actions";

export default function Page() {
  return (
    <div>
      <PageHead
        back={{ href: "/admin/slider", label: "Slider listesine dön" }}
        kicker="Yeni kayıt"
        title="Yeni slider"
        description="Masaüstü ve mobil görsel ile ana sayfada görünecek metni ekleyin."
      />
      <SliderForm action={saveSliderAction} />
    </div>
  );
}
