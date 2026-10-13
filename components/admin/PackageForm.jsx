"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { GripVertical, X } from "lucide-react";
import { parseJson } from "@/lib/json";
import { slugify } from "@/lib/slug";

const inp = "yonetim-alan";
const dosya =
  "block w-full max-w-full text-sm text-gri file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cam file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-fildisi hover:file:bg-camderin";

function Bolum({ baslik, aciklama, children }) {
  return (
    <section className="yonetim-kutu">
      <div className="border-b border-cizgi/80 pb-4">
        <h2 className="text-xl">{baslik}</h2>
        {aciklama ? <p className="mt-1 text-sm text-gri">{aciklama}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Alan({ label, children, hint, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="yonetim-etiket">{label}</span>
      {children}
      {hint ? <span className="yonetim-ipucu">{hint}</span> : null}
    </label>
  );
}

function Upload({ name, label, value, accept = "image/*", hint }) {
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
  const gorsel = accept.startsWith("image");
  return (
    <div>
      <p className="yonetim-etiket">{label}</p>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-cizgi bg-fildisi/70 p-3 sm:flex-row sm:items-center">
        {url && gorsel ? (
          <img src={url} alt="" className="h-28 w-full rounded-lg object-cover sm:h-20 sm:w-32 sm:shrink-0" />
        ) : null}
        {url && !gorsel ? (
          <span className="min-w-0 break-all rounded-lg bg-white px-3 py-2 text-sm font-medium text-cam">{url.split("/").pop()}</span>
        ) : null}
        <div className="min-w-0 flex-1">
          <input type="file" accept={accept} onChange={onFile} className={dosya} />
          {url ? (
            <button type="button" onClick={() => setUrl("")} className="mt-2 text-sm font-semibold text-red-700 hover:underline">
              Kaldır
            </button>
          ) : (
            <p className="mt-2 text-xs text-gri">Dosya seçin. Görseller WebP olarak saklanır.</p>
          )}
        </div>
      </div>
      {busy ? <p className="mt-1.5 text-sm text-gri">Yükleniyor…</p> : null}
      {err ? <p className="mt-1.5 text-sm text-red-700">{err}</p> : null}
      {hint ? <p className="yonetim-ipucu">{hint}</p> : null}
    </div>
  );
}

function ListField({ name, label, initial, placeholder }) {
  const [items, setItems] = useState(initial?.length ? initial : [""]);
  const [dragIdx, setDragIdx] = useState(null);
  const set = (i, v) => setItems(items.map((x, k) => (k === i ? v : x)));
  const drop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragIdx(null);
  };
  return (
    <div>
      <p className="yonetim-etiket">{label}</p>
      <ul className="space-y-2">
        {items.map((v, i) => (
          <li
            key={i}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(i)}
            className={`flex items-center gap-2 rounded-xl bg-fildisi/80 p-1.5 ${dragIdx === i ? "opacity-60" : ""}`}
          >
            <span className="cursor-grab px-1 text-gri" title="Sürükleyerek sıralayın" aria-hidden>
              <GripVertical className="h-4 w-4" />
            </span>
            <input name={`${name}[]`} value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} className={`${inp} min-w-0 flex-1`} />
            <button type="button" aria-label="Maddeyi sil" onClick={() => setItems(items.filter((_, k) => k !== i))} className="rounded-lg p-2 text-gri hover:bg-white hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="mt-2 inline-flex items-center rounded-lg border border-dashed border-cizgi px-3 py-1.5 text-sm font-semibold text-cam transition-colors hover:border-altin hover:text-altin"
      >
        + Madde ekle
      </button>
    </div>
  );
}

function GalleryField({ initial }) {
  const [items, setItems] = useState(initial || []);
  const [dragIdx, setDragIdx] = useState(null);
  const [busy, setBusy] = useState(false);
  async function onFiles(e) {
    setBusy(true);
    for (const file of e.target.files || []) {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (r.ok) {
        const j = await r.json();
        setItems((prev) => [...prev, j.url]);
      }
    }
    setBusy(false);
    e.target.value = "";
  }
  const drop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [m] = next.splice(dragIdx, 1);
    next.splice(i, 0, m);
    setItems(next);
    setDragIdx(null);
  };
  return (
    <div>
      <p className="yonetim-etiket">Galeri görselleri</p>
      {items.length ? (
        <div className="flex flex-wrap gap-3">
          {items.map((u, i) => (
            <div
              key={u + i}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(i)}
              className={`relative ${dragIdx === i ? "opacity-60" : ""}`}
            >
              <input type="hidden" name="gallery[]" value={u} />
              <img src={u} alt="" className="h-24 w-36 cursor-grab rounded-xl border border-cizgi object-cover shadow-kart" />
              <button
                type="button"
                aria-label="Görseli kaldır"
                onClick={() => setItems(items.filter((_, k) => k !== i))}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-cam/80 text-white hover:bg-red-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-cizgi bg-fildisi/70 px-4 py-6 text-center text-sm text-gri">
          Henüz galeri görseli yok.
        </p>
      )}
      <input type="file" accept="image/*" multiple onChange={onFiles} className={`mt-3 ${dosya}`} />
      {busy ? <p className="mt-1.5 text-sm text-gri">Yükleniyor…</p> : null}
      <p className="yonetim-ipucu">Görselleri sürükleyerek sıralayabilirsiniz.</p>
    </div>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-cam w-full disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto">
      {pending ? "Kaydediliyor…" : "Paketi kaydet"}
    </button>
  );
}

function Secim({ name, title, text, defaultChecked }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cizgi bg-fildisi/80 px-4 py-3 transition-colors hover:border-altin/40">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-altin" />
      <span>
        <span className="block text-sm font-semibold text-cam">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-gri">{text}</span>
      </span>
    </label>
  );
}

export default function PackageForm({ pkg, action }) {
  const [state, formAction] = useFormState(action, {});
  const p = pkg || {};
  const [name, setName] = useState(p.name || "");
  const [slug, setSlug] = useState(p.slug || "");
  const [seoTitle, setSeoTitle] = useState(p.seo_title || "");
  const [seoDesc, setSeoDesc] = useState(p.seo_desc || "");

  function onName(v) {
    setName(v);
    if (!p.id && !slug) setSlug(slugify(v));
    if (!seoTitle) setSeoTitle(v ? `${v} | Dört Bucak Tur` : "");
    if (!seoDesc && v) setSeoDesc(`${v} programının tarihleri, konaklama planı ve detayları. Bilgi için bize ulaşın.`);
  }

  return (
    <form action={formAction} className="space-y-5">
      {p.id ? <input type="hidden" name="id" value={p.id} /> : null}

      <Bolum baslik="Temel bilgiler" aciklama="Paketin adı, kategorisi ve sitede görünen metinler.">
        <div className="grid items-start gap-5 md:grid-cols-2">
          <Alan label="Kategori">
            <select name="category" defaultValue={p.category || "umre"} className={inp}>
              <option value="umre">Umre</option>
              <option value="hac">Hac</option>
              <option value="kultur">Kültür</option>
            </select>
          </Alan>
          <Alan label="Paket etiketi" hint="Örn: Ekonomik, Standart, Premium, Gençlik Umresi">
            <input name="label" defaultValue={p.label || ""} className={inp} />
          </Alan>
          <Alan label="Paket adı *">
            <input name="name" required value={name} onChange={(e) => onName(e.target.value)} className={inp} />
          </Alan>
          <Alan label="Bağlantı (slug)" hint="Boş bırakılırsa paket adından oluşur. Türkçe karakterler dönüştürülür.">
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className={inp} />
          </Alan>
        </div>
        <Alan label="Kısa açıklama">
          <textarea name="short_desc" rows={2} defaultValue={p.short_desc || ""} className={`${inp} resize-y`} />
        </Alan>
        <Alan label="Detaylı açıklama">
          <textarea name="long_desc" rows={5} defaultValue={p.long_desc || ""} className={`${inp} resize-y`} />
        </Alan>
      </Bolum>

      <Bolum baslik="Görseller ve dosyalar" aciklama="Kapak listelerde, galeri paket sayfasında görünür.">
        <Upload name="cover_image" label="Kapak görseli" value={p.cover_image} />
        <GalleryField initial={parseJson(p.gallery)} />
        <Upload name="pdf_file" label="Program dosyası (PDF)" value={p.pdf_file} accept="application/pdf" />
      </Bolum>

      <Bolum baslik="Tarih ve süre" aciklama="Kartlarda ve paket sayfasında tarih ile gece dağılımı olarak görünür.">
        <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Alan label="Başlangıç tarihi"><input type="date" name="start_date" defaultValue={p.start_date || ""} className={inp} /></Alan>
          <Alan label="Bitiş tarihi"><input type="date" name="end_date" defaultValue={p.end_date || ""} className={inp} /></Alan>
          <Alan label="Gece sayısı"><input type="number" min="0" name="nights" defaultValue={p.nights ?? ""} className={inp} /></Alan>
          <Alan label="Gün sayısı"><input type="number" min="0" name="days" defaultValue={p.days ?? ""} className={inp} /></Alan>
          <Alan label="Mekke gece sayısı"><input type="number" min="0" name="mecca_nights" defaultValue={p.mecca_nights ?? ""} className={inp} /></Alan>
          <Alan label="Medine gece sayısı"><input type="number" min="0" name="medina_nights" defaultValue={p.medina_nights ?? ""} className={inp} /></Alan>
        </div>
      </Bolum>

      <Bolum baslik="Fiyat ve kontenjan" aciklama="Fiyat boşsa sitede “Fiyat bilgisi için iletişime geçin” yazar.">
        <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Alan label="2 kişilik oda (kişi başı)"><input type="number" min="0" step="0.01" name="price_double" defaultValue={p.price_double ?? ""} className={inp} /></Alan>
          <Alan label="3 kişilik oda (kişi başı)"><input type="number" min="0" step="0.01" name="price_triple" defaultValue={p.price_triple ?? ""} className={inp} /></Alan>
          <Alan label="4 kişilik oda (kişi başı)"><input type="number" min="0" step="0.01" name="price_quad" defaultValue={p.price_quad ?? ""} className={inp} /></Alan>
          <Alan label="Para birimi">
            <select name="currency" defaultValue={p.currency || "USD"} className={inp}>
              <option>USD</option><option>EUR</option><option>TRY</option><option>SAR</option>
            </select>
          </Alan>
          <Alan label="Kontenjan durumu">
            <select name="quota_status" defaultValue={p.quota_status || "var"} className={inp}>
              <option value="var">Kontenjan var</option>
              <option value="az">Son kontenjanlar</option>
              <option value="dolu">Kontenjan doldu</option>
            </select>
          </Alan>
        </div>
      </Bolum>

      <Bolum baslik="Program içeriği" aciklama="Maddeleri sürükleyerek sıralayın. Boş satırlar kayda yazılmaz.">
        <ListField name="highlights" label="Kısa öne çıkan özellikler" initial={parseJson(p.highlights)} placeholder="Örn: Rehber eşliğinde program" />
        <ListField name="included" label="Pakete dahil hizmetler" initial={parseJson(p.included)} placeholder="Örn: Gidiş–dönüş ulaşım" />
        <ListField name="excluded" label="Pakete dahil olmayan hizmetler" initial={parseJson(p.excluded)} placeholder="Örn: Kişisel harcamalar" />
        <ListField name="itinerary" label="Program akışı" initial={parseJson(p.itinerary)} placeholder="Örn: Medine'ye varış ve yerleşme" />
        <ListField name="documents" label="Gerekli belgeler" initial={parseJson(p.documents)} placeholder="Örn: En az 1 yıl geçerli pasaport" />
        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Alan label="Ulaşım bilgisi"><textarea name="transport_info" rows={3} defaultValue={p.transport_info || ""} className={`${inp} resize-y`} /></Alan>
          <Alan label="Konaklama bilgisi"><textarea name="lodging_info" rows={3} defaultValue={p.lodging_info || ""} className={`${inp} resize-y`} /></Alan>
          <Alan label="Rehberlik bilgisi"><textarea name="guide_info" rows={3} defaultValue={p.guide_info || ""} className={`${inp} resize-y`} /></Alan>
        </div>
        <Alan label="Önemli açıklamalar">
          <textarea name="notes" rows={3} defaultValue={p.notes || ""} className={`${inp} resize-y`} />
        </Alan>
      </Bolum>

      <Bolum baslik="SEO ve yayın" aciklama="Arama sonucu metinleri boşsa paket adından önerilir; dilediğiniz gibi değiştirin.">
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <Alan label="SEO başlığı">
            <input name="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inp} />
          </Alan>
          <Alan label="SEO açıklaması">
            <textarea name="seo_desc" rows={2} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className={`${inp} resize-y`} />
          </Alan>
          <Alan label="Gösterim sırası" hint="Küçük sayı önce görünür. Listeden oklarla da değişir.">
            <input type="number" name="sort_order" defaultValue={p.sort_order ?? 0} className={inp} />
          </Alan>
        </div>
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <Secim name="featured" title="Ana sayfada öne çıkar" text="Paket, ana sayfadaki öne çıkanlar bölümünde görünür." defaultChecked={!!p.featured} />
          <Secim name="active" title="Yayında" text="Kapalıysa paket taslak kalır ve sitede listelenmez." defaultChecked={p.id ? !!p.active : true} />
        </div>
      </Bolum>

      {state?.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-cizgi bg-kagit/95 p-3 shadow-kartust backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="px-1 text-sm text-gri">Kayıt, paket sayfasını ve listeleri günceller.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SubmitBtn />
          <a href="/admin/paketler" className="btn-cerceve w-full sm:w-auto">Vazgeç</a>
        </div>
      </div>
    </form>
  );
}
