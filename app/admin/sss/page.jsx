import Link from "next/link";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { getFaqs } from "@/lib/db";
import ConfirmButton from "@/components/admin/ConfirmButton";
import PageHead, { Bos, Flash } from "@/components/admin/PageHead";
import { deleteFaqAction, toggleFaqAction, moveFaqAction } from "../actions";

export const dynamic = "force-dynamic";

const grupAd = {
  program: "Program",
  fiyat: "Fiyat",
  evrak: "Evrak",
};

export default async function AdminFaqs({ searchParams }) {
  const kayitlar = await getFaqs(false);
  const yayinda = kayitlar.filter((s) => s.active).length;

  return (
    <div>
      <PageHead
        kicker="İçerik"
        title="Sık sorulan sorular"
        description="SSS sayfasındaki sorular ve ana sayfada öne çıkanlar. Sıra, sitedeki gösterim sırasıdır."
        action={
          <Link href="/admin/sss/yeni" className="btn-cam w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden />
            Yeni soru
          </Link>
        }
      />
      {searchParams?.kayit ? <Flash>Soru kaydedildi. SSS sayfası güncellendi.</Flash> : null}

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
        <Bos title="Henüz soru yok" text="Yeni soru ekleyerek SSS sayfasını doldurun." />
      ) : (
        <div className="space-y-3">
          {kayitlar.map((s, i) => (
            <article key={s.id} className="overflow-hidden rounded-2xl border border-cizgi bg-kagit shadow-kart">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:p-5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-altin">{grupAd[s.group_key] || s.group_key}</p>
                  <Link href={`/admin/sss/${s.id}`} className="mt-0.5 block break-words font-display text-xl text-cam hover:text-altin">
                    {s.question}
                  </Link>
                  <p className="mt-1 line-clamp-2 break-words text-sm text-gri">{s.answer}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.active ? "bg-cam text-fildisi" : "bg-murekkep/10 text-gri"}`}>
                    {s.active ? "Yayında" : "Taslak"}
                  </span>
                  {s.featured ? (
                    <span className="rounded-full bg-altin/15 px-2.5 py-0.5 text-xs font-semibold text-altin">Ana sayfa</span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 border-t border-cizgi/80 bg-fildisi/50 px-4 py-3 sm:px-5">
                <div className="inline-flex overflow-hidden rounded-lg border border-cizgi bg-white">
                  <form action={moveFaqAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value="up" />
                    <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Yukarı taşı" disabled={i === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </form>
                  <form action={moveFaqAction} className="border-l border-cizgi">
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value="down" />
                    <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Aşağı taşı" disabled={i === kayitlar.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                <Link href={`/admin/sss/${s.id}`} className="yonetim-birincil">Düzenle</Link>
                <form action={toggleFaqAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="field" value="active" />
                  <button className="yonetim-eylem">{s.active ? "Taslağa al" : "Yayınla"}</button>
                </form>
                <form action={toggleFaqAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="field" value="featured" />
                  <button className="yonetim-eylem">{s.featured ? "Ana sayfadan kaldır" : "Ana sayfada göster"}</button>
                </form>
                <form action={deleteFaqAction} className="sm:ml-auto">
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton
                    message={`"${s.question}" sorusunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
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
