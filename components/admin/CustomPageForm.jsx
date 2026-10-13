"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const dosya =
  "block w-full max-w-full text-sm text-gri file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cam file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-fildisi hover:file:bg-camderin";

function Upload({ name, label, value, hint }) {
  const [url, setUrl] = useState(value || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Yükleme başarısız.");
      setUrl(j.url);
    } catch (er) {
      setErr(er.message);
    }
    setBusy(false);
  }
  return (
    <div className="min-w-0">
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

function Kaydet() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-cam w-full disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto">
      {pending ? "Kaydediliyor…" : "Sayfa metnini kaydet"}
    </button>
  );
}

export default function CustomPageForm({ sayfa, action }) {
  const [state, formAction] = useFormState(action, {});
  const s = sayfa || {};
  return (
    <form action={formAction} className="space-y-5">
      <section className="yonetim-kutu">
        <div className="border-b border-cizgi/80 pb-4">
          <h2 className="text-xl">Sayfa metni ve görseller</h2>
          <p className="mt-1 text-sm text-gri">Kapak açıklaması, iki paragraf ve sayfadaki fotoğraflar.</p>
        </div>
        <label className="block min-w-0">
          <span className="yonetim-etiket">Kapak açıklaması *</span>
          <textarea name="lead" required rows={3} defaultValue={s.lead || ""} className="yonetim-alan resize-y" />
        </label>
        <label className="block min-w-0">
          <span className="yonetim-etiket">İlk paragraf *</span>
          <textarea name="body_1" required rows={4} defaultValue={s.body_1 || ""} className="yonetim-alan resize-y" />
        </label>
        <label className="block min-w-0">
          <span className="yonetim-etiket">İkinci paragraf</span>
          <textarea name="body_2" rows={4} defaultValue={s.body_2 || ""} className="yonetim-alan resize-y" />
        </label>
        <div className="grid items-start gap-5 md:grid-cols-2">
          <Upload name="cover_image" label="Kapak görseli" value={s.cover_image} hint="Sayfanın üstündeki geniş görsel." />
          <Upload name="side_image" label="Yan görsel" value={s.side_image} hint="Metnin yanındaki dikey fotoğraf." />
        </div>
      </section>
      {state?.error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Kaydet />
      </div>
    </form>
  );
}
