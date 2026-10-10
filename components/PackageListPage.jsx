import PackageFilters from "@/components/PackageFilters";
import Reveal from "@/components/Reveal";
import SayfaKapak from "@/components/SayfaKapak";
import { getPackages } from "@/lib/db";

// Kategoriye göre başlık bandı görseli. Tam genişlik kapladıkları için
// geniş (2000px) slider görselleri kullanılır; kart görselleri esnerdi.
const bandGorseli = {
  hac: "/images/slider-2-masaustu.webp",
  umre: "/images/slider-1-masaustu.webp",
};

export default async function PackageListPage({ category, title, intro }) {
  const packages = await getPackages({ category });
  const gorsel = bandGorseli[category] || bandGorseli.umre;

  return (
    <>
      {/* Başlık bandı — ana sayfadaki hero ile aynı dili konuşur, ama daha kısa */}
      <SayfaKapak kicker="Programlarımız" baslik={title} aciklama={intro} gorsel={gorsel} />

      <div className="site-container py-16">
        {packages.length === 0 ? (
          <p className="kart p-10 text-center text-gri">
            Şu anda yayında program bulunmuyor. Yaklaşan tarihler için lütfen bizimle iletişime geçin.
          </p>
        ) : (
          <Reveal>
            <PackageFilters packages={packages} />
          </Reveal>
        )}
      </div>
    </>
  );
}
