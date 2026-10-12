import { Phone } from "lucide-react";
import PackageFilters from "@/components/PackageFilters";
import Reveal from "@/components/Reveal";
import SayfaKapak from "@/components/SayfaKapak";
import { WaIcon } from "@/components/SocialLinks";
import { getPackages } from "@/lib/db";
import { site, telLink, waLink } from "@/lib/site";

// Kategoriye göre başlık bandı görseli. Tam genişlik kapladıkları için
// geniş (2000px) slider görselleri kullanılır; kart görselleri esnerdi.
const bandGorseli = {
  hac: "/images/slider-2-masaustu.webp",
  umre: "/images/slider-1-masaustu.webp",
};

export default async function PackageListPage({ category, title, intro }) {
  const packages = await getPackages({ category });
  const gorsel = bandGorseli[category] || bandGorseli.umre;
  const kelimeler = title.split(" ");
  const vurgu = kelimeler.length > 1 ? kelimeler.pop() : null;

  return (
    <>
      <SayfaKapak kicker="Programlarımız" baslik={kelimeler.join(" ")} vurgu={vurgu} aciklama={intro} gorsel={gorsel} />

      <div className="site-container py-16 md:py-20">
        {packages.length === 0 ? (
          <p className="kart p-10 text-center text-gri">
            Şu anda yayında program bulunmuyor. Yaklaşan tarihler için lütfen bizimle iletişime geçin.
          </p>
        ) : (
          <Reveal>
            <PackageFilters packages={packages} />
          </Reveal>
        )}

        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-cam px-7 py-10 text-fildisi shadow-derin md:px-12">
            <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="kicker-acik">Kişiye özel bilgi</p>
                <h2 className="mt-3 text-2xl !text-fildisi md:text-3xl">Size uygun programı birlikte seçelim</h2>
                <p className="mt-2 text-fildisi/65">Tarih, kontenjan ve oda tipi için güncel bilgiyi hemen paylaşalım.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink(`Merhaba, ${title.toLowerCase()} hakkında bilgi almak istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-altin"
                >
                  <WaIcon /> WhatsApp
                </a>
                <a href={telLink()} className="btn-cam-uzeri">
                  <Phone className="h-4 w-4" aria-hidden /> {site.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
