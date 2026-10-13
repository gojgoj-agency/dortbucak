"use client";
import { useFormState, useFormStatus } from "react-dom";

const ikonlar = [
  ["CalendarRange", "Takvim"],
  ["Users", "Grup"],
  ["Route", "Güzergâh"],
  ["Hotel", "Konaklama"],
  ["Compass", "Pusula"],
  ["MapPin", "Konum"],
  ["Heart", "Kalp"],
  ["Phone", "Telefon"],
];

function Kaydet() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-cam w-full disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto">
      {pending ? "Kaydediliyor…" : "Kartı kaydet"}
    </button>
  );
}

export default function CustomPointForm({ kayit, action }) {
  const [state, formAction] = useFormState(action, {});
  const s = kayit || {};
  return (
    <form action={formAction} className="space-y-5">
      {s.id ? <input type="hidden" name="id" value={s.id} /> : null}
      <section className="yonetim-kutu">
        <div className="border-b border-cizgi/80 pb-4">
          <h2 className="text-xl">Kart</h2>
          <p className="mt-1 text-sm text-gri">Başlık ve kısa metin, sayfanın altındaki kartlarda görünür.</p>
        </div>
        <div className="grid items-start gap-5 md:grid-cols-2">
          <label className="block min-w-0">
            <span className="yonetim-etiket">İkon</span>
            <select name="icon" defaultValue={s.icon || "CalendarRange"} className="yonetim-alan">
              {ikonlar.map(([deger, ad]) => <option key={deger} value={deger}>{ad}</option>)}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="yonetim-etiket">Sıra</span>
            <input type="number" name="sort_order" defaultValue={s.sort_order ?? 0} className="yonetim-alan" />
            <span className="yonetim-ipucu">Küçük sayı önce görünür.</span>
          </label>
        </div>
        <label className="block min-w-0">
          <span className="yonetim-etiket">Başlık *</span>
          <input name="title" required defaultValue={s.title || ""} className="yonetim-alan" />
        </label>
        <label className="block min-w-0">
          <span className="yonetim-etiket">Metin *</span>
          <textarea name="body" required rows={4} defaultValue={s.body || ""} className="yonetim-alan resize-y" />
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cizgi bg-fildisi/80 px-4 py-3">
          <input type="checkbox" name="active" defaultChecked={s.id ? !!s.active : true} className="mt-1 h-4 w-4 shrink-0 accent-altin" />
          <span>
            <span className="block text-sm font-semibold text-cam">Yayında</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-gri">Kapalıysa bu kart sayfada görünmez.</span>
          </span>
        </label>
      </section>
      {state?.error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p> : null}
      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-cizgi bg-kagit/95 p-3 shadow-kartust backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="px-1 text-sm text-gri">Kayıt, kişiye özel turlar sayfasını günceller.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Kaydet />
          <a href="/admin/kisiye-ozel" className="btn-cerceve w-full sm:w-auto">Vazgeç</a>
        </div>
      </div>
    </form>
  );
}
