"use client";
import { useFormState, useFormStatus } from "react-dom";

const gruplar = [
  ["program", "Program ve yolculuk"],
  ["fiyat", "Fiyat ve konaklama"],
  ["evrak", "Evrak ve sağlık"],
];

function Kaydet() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-cam w-full disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto">
      {pending ? "Kaydediliyor…" : "Soruyu kaydet"}
    </button>
  );
}

export default function FaqForm({ kayit, action }) {
  const [state, formAction] = useFormState(action, {});
  const s = kayit || {};
  return (
    <form action={formAction} className="space-y-5">
      {s.id ? <input type="hidden" name="id" value={s.id} /> : null}
      <section className="yonetim-kutu">
        <div className="border-b border-cizgi/80 pb-4">
          <h2 className="text-xl">Soru ve cevap</h2>
          <p className="mt-1 text-sm text-gri">Konu, SSS sayfasındaki bölümü belirler. Ana sayfa işareti kısa listede gösterir.</p>
        </div>
        <div className="grid items-start gap-5 md:grid-cols-2">
          <label className="block min-w-0">
            <span className="yonetim-etiket">Konu</span>
            <select name="group_key" defaultValue={s.group_key || "program"} className="yonetim-alan">
              {gruplar.map(([deger, ad]) => <option key={deger} value={deger}>{ad}</option>)}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="yonetim-etiket">Sıra</span>
            <input type="number" name="sort_order" defaultValue={s.sort_order ?? 0} className="yonetim-alan" />
            <span className="yonetim-ipucu">Küçük sayı önce görünür. Listeden oklarla da değişir.</span>
          </label>
        </div>
        <label className="block min-w-0">
          <span className="yonetim-etiket">Soru *</span>
          <input name="question" required defaultValue={s.question || ""} className="yonetim-alan" />
        </label>
        <label className="block min-w-0">
          <span className="yonetim-etiket">Cevap *</span>
          <textarea name="answer" required rows={5} defaultValue={s.answer || ""} className="yonetim-alan resize-y" />
        </label>
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cizgi bg-fildisi/80 px-4 py-3">
            <input type="checkbox" name="featured" defaultChecked={!!s.featured} className="mt-1 h-4 w-4 shrink-0 accent-altin" />
            <span>
              <span className="block text-sm font-semibold text-cam">Ana sayfada göster</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-gri">İşaretli sorular ana sayfadaki kısa listede durur.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cizgi bg-fildisi/80 px-4 py-3">
            <input type="checkbox" name="active" defaultChecked={s.id ? !!s.active : true} className="mt-1 h-4 w-4 shrink-0 accent-altin" />
            <span>
              <span className="block text-sm font-semibold text-cam">Yayında</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-gri">Kapalıysa soru sitede görünmez.</span>
            </span>
          </label>
        </div>
      </section>
      {state?.error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p> : null}
      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-cizgi bg-kagit/95 p-3 shadow-kartust backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="px-1 text-sm text-gri">Kayıt, SSS sayfasını ve ana sayfadaki listeyi günceller.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Kaydet />
          <a href="/admin/sss" className="btn-cerceve w-full sm:w-auto">Vazgeç</a>
        </div>
      </div>
    </form>
  );
}
