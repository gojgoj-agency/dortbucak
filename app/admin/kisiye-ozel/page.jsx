import Link from "next/link";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { getCustomPage, getCustomPoints } from "@/lib/db";
import ConfirmButton from "@/components/admin/ConfirmButton";
import CustomPageForm from "@/components/admin/CustomPageForm";
import PageHead, { Bos, Flash } from "@/components/admin/PageHead";
import { deleteCustomPointAction, moveCustomPointAction, saveCustomPageAction, toggleCustomPointAction } from "../actions";

export const dynamic = "force-dynamic";

const ikonAd = {
  CalendarRange: "Takvim",
  Users: "Grup",
  Route: "Güzergâh",
  Hotel: "Konaklama",
  Compass: "Pusula",
  MapPin: "Konum",
  Heart: "Kalp",
  Phone: "Telefon",
};

export default async function AdminCustomTours({ searchParams }) {
  const sayfa = await getCustomPage();
  const kayitlar = await getCustomPoints(false);
  const yayinda = kayitlar.filter((s) => s.active).length;

  return (
    <div>
      <PageHead
        kicker="İçerik"
        title="Özel Turlar"
        description="Sayfa metni, fotoğraflar ve alttaki kartlar. Sıra, sitedeki gösterim sırasıdır."
      />
      {searchParams?.kayit === "sayfa" ? <Flash>Sayfa metni kaydedildi.</Flash> : null}
      {searchParams?.kayit === "1" ? <Flash>Kart kaydedildi. Sayfa güncellendi.</Flash> : null}

      <CustomPageForm sayfa={sayfa} action={saveCustomPageAction} />

      <div className="mt-12">
        <PageHead
          kicker="Kartlar"
          title="Öne çıkanlar"
          description="Tarih, grup, güzergâh ve konaklama gibi kısa maddeler."
          action={
            <Link href="/admin/kisiye-ozel/yeni" className="btn-cam w-full sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden />
              Yeni kart
            </Link>
          }
        />

        <dl className="mb-6 grid grid-cols-2 gap-3 sm:max-w-md">
          {[
            ["Toplam", kayitlar.length],
            ["Yayında", yayinda],
          ].map(([ad, deger]) => (
            <div key={ad} className="rounded-2xl border border-cizgi bg-kagit px-4 py-4 shadow-kart">
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-altin">{ad}</dt>
              <dd className="mt-1 font-display text-3xl leading-none text-cam">{deger}</dd>
            </div>
          ))}
        </dl>

        {kayitlar.length === 0 ? (
          <Bos title="Henüz kart yok" text="Yeni kart ekleyerek sayfadaki maddeleri oluşturun." />
        ) : (
          <div className="space-y-3">
            {kayitlar.map((s, i) => (
              <article key={s.id} className="overflow-hidden rounded-2xl border border-cizgi bg-kagit shadow-kart">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-altin">{ikonAd[s.icon] || s.icon}</p>
                    <Link href={`/admin/kisiye-ozel/${s.id}`} className="mt-0.5 block break-words font-display text-xl text-cam hover:text-altin">
                      {s.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 break-words text-sm text-gri">{s.body}</p>
                  </div>
                  <span className={`w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.active ? "bg-cam text-fildisi" : "bg-murekkep/10 text-gri"}`}>
                    {s.active ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 border-t border-cizgi/80 bg-fildisi/50 px-4 py-3 sm:px-5">
                  <div className="inline-flex overflow-hidden rounded-lg border border-cizgi bg-white">
                    <form action={moveCustomPointAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Yukarı taşı" disabled={i === 0}>
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={moveCustomPointAction} className="border-l border-cizgi">
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Aşağı taşı" disabled={i === kayitlar.length - 1}>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                  <Link href={`/admin/kisiye-ozel/${s.id}`} className="yonetim-birincil">Düzenle</Link>
                  <form action={toggleCustomPointAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="yonetim-eylem">{s.active ? "Taslağa al" : "Yayınla"}</button>
                  </form>
                  <form action={deleteCustomPointAction} className="sm:ml-auto">
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton
                      message={`"${s.title}" kartını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                      className="yonetim-tehlike"
                    >
                      Sil
                    </ConfirmButton>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
