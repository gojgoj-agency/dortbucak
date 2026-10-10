import { notFound } from "next/navigation";
import SliderForm from "@/components/admin/SliderForm";
import PageHead from "@/components/admin/PageHead";
import { getSliderById } from "@/lib/db";
import { saveSliderAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const slider = await getSliderById(Number(params.id));
  if (!slider) notFound();
  return (
    <div>
      <PageHead
        back={{ href: "/admin/slider", label: "Slider listesine dön" }}
        kicker="Düzenle"
        title={slider.title}
        description="Kayıt, ana sayfadaki vitrini hemen günceller."
      />
      <SliderForm slider={slider} action={saveSliderAction} />
    </div>
  );
}
