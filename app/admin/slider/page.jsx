import Link from "next/link";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { getSliders } from "@/lib/db";
import ConfirmButton from "@/components/admin/ConfirmButton";
import PageHead, { Bos, Flash } from "@/components/admin/PageHead";
import { deleteSliderAction, toggleSliderAction, moveSliderAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSliders({ searchParams }) {
  const sliders = await getSliders(false);
  const yayinda = sliders.filter((s) => s.active).length;

  return (
    <div>
      <PageHead
        kicker="Vitrin"
        title="Slider"
        description="Ana sayfanın en üstündeki görseller, başlıklar ve düğmeler. Sıra, sitedeki gösterim sırasıdır."
        action={
          <Link href="/admin/slider/yeni" className="btn-cam w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden />
            Yeni slider
          </Link>
        }
      />
      {searchParams?.kayit ? <Flash>Slider kaydedildi. Ana sayfa güncellendi.</Flash> : null}

      <dl className="mb-6 grid grid-cols-2 gap-3 sm:max-w-md">
        {[
          ["Toplam", sliders.length],
          ["Yayında", yayinda],
        ].map(([ad, deger]) => (
          <div key={ad} className="rounded-2xl border border-cizgi bg-kagit px-4 py-4 shadow-kart">
            <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-altin">{ad}</dt>
            <dd className="mt-1 font-display text-3xl leading-none text-cam">{deger}</dd>
          </div>
        ))}
      </dl>

      {sliders.length === 0 ? (
        <Bos title="Henüz slider yok" text="Yeni slider ekleyerek ana sayfa vitrinini oluşturun." />
      ) : (
        <div className="space-y-3">
          {sliders.map((s, i) => (
            <article key={s.id} className="overflow-hidden rounded-2xl border border-cizgi bg-kagit shadow-kart">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-cam/5 sm:h-24 sm:w-40">
                  {s.image_desktop || s.image_mobile ? (
                    <img src={s.image_desktop || s.image_mobile} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gri">Görsel yok</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {s.kicker ? <p className="text-xs font-bold uppercase tracking-[0.16em] text-altin">{s.kicker}</p> : null}
                  <Link href={`/admin/slider/${s.id}`} className="mt-0.5 block font-display text-xl text-cam hover:text-altin">
                    {s.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-gri">{s.description || "Açıklama yok"}</p>
                  <p className="mt-1 break-all text-xs text-gri/80">{s.button_text || "Düğme yok"} · {s.button_link || "bağlantı yok"}</p>
                </div>
                <span className={`w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.active ? "bg-cam text-fildisi" : "bg-murekkep/10 text-gri"}`}>
                  {s.active ? "Yayında" : "Taslak"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 border-t border-cizgi/80 bg-fildisi/50 px-4 py-3 sm:px-5">
                <div className="inline-flex overflow-hidden rounded-lg border border-cizgi bg-white">
                  <form action={moveSliderAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value="up" />
                    <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Yukarı taşı" disabled={i === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </form>
                  <form action={moveSliderAction} className="border-l border-cizgi">
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value="down" />
                    <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Aşağı taşı" disabled={i === sliders.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                <Link href={`/admin/slider/${s.id}`} className="yonetim-birincil">Düzenle</Link>
                <form action={toggleSliderAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="yonetim-eylem">{s.active ? "Taslağa al" : "Yayınla"}</button>
                </form>
                <form action={deleteSliderAction} className="sm:ml-auto">
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton
                    message={`"${s.title}" slider'ını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
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
  );
}
