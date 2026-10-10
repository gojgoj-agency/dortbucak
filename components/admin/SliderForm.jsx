"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const inp = "yonetim-alan";
const dosya =
  "max-w-full text-sm text-gri file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cam file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-fildisi hover:file:bg-camderin";

function Upload({ name, label, value, hint }) {
  const [url, setUrl] = useState(value || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Yükleme başarısız.");
      setUrl(j.url);
    } catch (er) { setErr(er.message); }
    setBusy(false);
  }
  return (
    <div>
      <p className="yonetim-etiket">{label}</p>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-cizgi bg-fildisi/70 p-3 sm:flex-row sm:items-center">
        {url ? <img src={url} alt="" className="h-28 w-full rounded-lg object-cover sm:h-20 sm:w-36 sm:shrink-0" /> : null}
        <div className="min-w-0 flex-1">
          <input type="file" accept="image/*" onChange={onFile} className={dosya} />
          {url ? (
            <button type="button" onClick={() => setUrl("")} className="mt-2 text-sm font-semibold text-red-700 hover:underline">
              Kaldır
            </button>
          ) : (
            <p className="mt-2 text-xs text-gri">{hint}</p>
          )}
        </div>
      </div>
      {busy ? <p className="mt-1.5 text-sm text-gri">Yükleniyor…</p> : null}
      {err ? <p className="mt-1.5 text-sm text-red-700">{err}</p> : null}
    </div>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-cam w-full disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto">
      {pending ? "Kaydediliyor…" : "Slider'ı kaydet"}
    </button>
  );
}

export default function SliderForm({ slider, action }) {
  const [state, formAction] = useFormState(action, {});
  const s = slider || {};
  return (
    <form action={formAction} className="space-y-5">
      {s.id ? <input type="hidden" name="id" value={s.id} /> : null}

      <section className="yonetim-kutu">
        <div className="border-b border-cizgi/80 pb-4">
          <h2 className="text-xl">Görseller</h2>
          <p className="mt-1 text-sm text-gri">Geniş ekranda masaüstü, telefonda mobil görsel kullanılır.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Upload name="image_desktop" label="Masaüstü görseli" value={s.image_desktop} hint="Yatay, en az 1600 piksel genişlik uygun olur." />
          <Upload name="image_mobile" label="Mobil görseli" value={s.image_mobile} hint="Dikey kadraj, yazının okunacağı boşluk bırakın." />
        </div>
      </section>

      <section className="yonetim-kutu">
        <div className="border-b border-cizgi/80 pb-4">
          <h2 className="text-xl">Metin ve bağlantı</h2>
          <p className="mt-1 text-sm text-gri">Başlık görselin üzerinde, düğme verilen adrese gider.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="yonetim-etiket">Küçük üst başlık</span>
            <input name="kicker" defaultValue={s.kicker || ""} className={inp} />
          </label>
          <label className="block">
            <span className="yonetim-etiket">Ana başlık *</span>
            <input name="title" required defaultValue={s.title || ""} className={inp} />
          </label>
        </div>
        <label className="block">
          <span className="yonetim-etiket">Kısa açıklama</span>
          <textarea name="description" rows={2} defaultValue={s.description || ""} className={`${inp} resize-y`} />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="yonetim-etiket">Düğme metni</span>
            <input name="button_text" defaultValue={s.button_text || ""} className={inp} />
          </label>
          <label className="block">
            <span className="yonetim-etiket">Düğme bağlantısı</span>
            <input name="button_link" defaultValue={s.button_link || ""} placeholder="/umre-turlari" className={inp} />
          </label>
          <label className="block">
            <span className="yonetim-etiket">Gösterim sırası</span>
            <input type="number" name="sort_order" defaultValue={s.sort_order ?? 0} className={inp} />
            <span className="yonetim-ipucu block">Küçük sayı önce görünür.</span>
          </label>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cizgi bg-fildisi/80 px-4 py-3">
          <input type="checkbox" name="active" defaultChecked={s.id ? !!s.active : true} className="mt-1 h-4 w-4 accent-altin" />
          <span>
            <span className="block text-sm font-semibold text-cam">Yayında</span>
            <span className="mt-0.5 block text-xs text-gri">Kapalıysa bu slayt ana sayfada görünmez.</span>
          </span>
        </label>
      </section>

      {state?.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-cizgi bg-kagit/95 p-3 shadow-kartust backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="px-1 text-sm text-gri">Kayıt, ana sayfadaki vitrini günceller.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SubmitBtn />
          <a href="/admin/slider" className="btn-cerceve w-full sm:w-auto">Vazgeç</a>
        </div>
      </div>
    </form>
  );
}
