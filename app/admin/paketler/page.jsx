import Link from "next/link";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { getPackages } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/site";
import ConfirmButton from "@/components/admin/ConfirmButton";
import PageHead, { Bos, Flash } from "@/components/admin/PageHead";
import {
  deletePackageAction,
  duplicatePackageAction,
  togglePackageAction,
  movePackageAction,
} from "../actions";

export const dynamic = "force-dynamic";

const kota = {
  var: ["Kontenjan var", "bg-emerald-50 text-emerald-800"],
  az: ["Son kontenjan", "bg-amber-50 text-amber-900"],
  dolu: ["Dolu", "bg-red-50 text-red-800"],
};

function tarih(p) {
  const a = formatDate(p.start_date);
  const b = formatDate(p.end_date);
  if (a && b) return `${a} – ${b}`;
  return a || b || "Tarih belirtilmedi";
}

function sure(p) {
  return [p.days ? `${p.days} gün` : null, p.nights ? `${p.nights} gece` : null].filter(Boolean).join(" · ");
}

function Grup({ title, tone, items }) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="kicker">{tone === "hac" ? "Hac" : tone === "kultur" ? "Kültür" : "Umre"}</p>
          <h2 className="mt-1 text-2xl">{title}</h2>
        </div>
        <p className="text-sm text-gri">{items.length} paket</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-4">
          <Bos title="Bu kategoride paket yok" text="Yeni paket ekleyerek programı oluşturun." />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((p, i) => {
            const fiyat = formatPrice(p.price_double, p.currency);
            const [kotaYazi, kotaSinif] = kota[p.quota_status] || kota.var;
            const gun = sure(p);
            return (
              <article key={p.id} className="overflow-hidden rounded-2xl border border-cizgi bg-kagit shadow-kart">
                <div className="flex">
                  <div className={`w-1 shrink-0 ${tone === "hac" ? "bg-cam" : "bg-altin"}`} aria-hidden />
                  <div className="min-w-0 flex-1 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-cam/5 sm:h-28 sm:w-40">
                        {p.cover_image ? (
                          <img src={p.cover_image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gri">Görsel yok</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            {p.label ? <p className="text-xs font-bold uppercase tracking-[0.16em] text-altin">{p.label}</p> : null}
                            <Link href={`/admin/paketler/${p.id}`} className="mt-0.5 block font-display text-xl text-cam hover:text-altin">
                              {p.name}
                            </Link>
                            <p className="mt-1 text-sm text-gri">
                              {tarih(p)}
                              {gun ? ` · ${gun}` : ""}
                            </p>
                            <p className="mt-0.5 break-all text-xs text-gri/80">/paket/{p.slug}</p>
                          </div>
                          <p className="font-display text-lg text-cam">{fiyat || "Bilgi alın"}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.active ? "bg-cam text-fildisi" : "bg-murekkep/10 text-gri"}`}>
                            {p.active ? "Yayında" : "Taslak"}
                          </span>
                          {p.featured ? (
                            <span className="rounded-full bg-altin/15 px-2.5 py-0.5 text-xs font-semibold text-altin">Öne çıkan</span>
                          ) : null}
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${kotaSinif}`}>{kotaYazi}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 border-t border-cizgi/80 bg-fildisi/50 px-4 py-3 sm:px-5">
                  <div className="inline-flex overflow-hidden rounded-lg border border-cizgi bg-white">
                    <form action={movePackageAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Yukarı taşı" disabled={i === 0}>
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={movePackageAction} className="border-l border-cizgi">
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button className="px-2.5 py-1.5 text-cam hover:bg-fildisi disabled:opacity-30" aria-label="Aşağı taşı" disabled={i === items.length - 1}>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                  <Link href={`/admin/paketler/${p.id}`} className="yonetim-birincil">Düzenle</Link>
                  <form action={togglePackageAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="active" />
                    <button className="yonetim-eylem">{p.active ? "Taslağa al" : "Yayınla"}</button>
                  </form>
                  <form action={togglePackageAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="featured" />
                    <button className="yonetim-eylem">{p.featured ? "Öne çıkarma" : "Öne çıkar"}</button>
                  </form>
                  <form action={duplicatePackageAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="yonetim-eylem">Çoğalt</button>
                  </form>
                  <form action={deletePackageAction} className="sm:ml-auto">
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton
                      message={`"${p.name}" paketini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                      className="yonetim-tehlike"
                    >
                      Sil
                    </ConfirmButton>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default async function AdminPackages({ searchParams }) {
  const all = await getPackages({ onlyActive: false });
  const yayinda = all.filter((p) => p.active).length;
  const ozet = [
    ["Toplam", all.length],
    ["Yayında", yayinda],
    ["Umre", all.filter((p) => p.category === "umre").length],
    ["Hac", all.filter((p) => p.category === "hac").length],
    ["Kültür", all.filter((p) => p.category === "kultur").length],
  ];

  return (
    <div>
      <PageHead
        kicker="İçerik"
        title="Paketler"
        description="Hac, umre ve kültür programlarını sıralayın, yayınlayın veya ana sayfada öne çıkarın."
        action={
          <Link href="/admin/paketler/yeni" className="btn-cam w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden />
            Yeni paket
          </Link>
        }
      />
      {searchParams?.kayit ? <Flash>Paket kaydedildi. Sitedeki liste güncellendi.</Flash> : null}

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ozet.map(([ad, deger]) => (
          <div key={ad} className="rounded-2xl border border-cizgi bg-kagit px-4 py-4 shadow-kart">
            <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-altin">{ad}</dt>
            <dd className="mt-1 font-display text-3xl leading-none text-cam">{deger}</dd>
          </div>
        ))}
      </dl>

      <Grup title="Umre paketleri" tone="umre" items={all.filter((p) => p.category === "umre")} />
      <Grup title="Hac paketleri" tone="hac" items={all.filter((p) => p.category === "hac")} />
      <Grup title="Kültür turları" tone="kultur" items={all.filter((p) => p.category === "kultur")} />
    </div>
  );
}
