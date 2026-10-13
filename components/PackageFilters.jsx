"use client";
import { useMemo, useState } from "react";
import PackageCard from "./PackageCard";

// Paket sayısı azsa filtre alanı otomatik gizlenir.
export default function PackageFilters({ packages, showCategory = false }) {
  const [month, setMonth] = useState("");
  const [dur, setDur] = useState("");
  const [cat, setCat] = useState("");

  const months = useMemo(
    () => [...new Set(packages.map((p) => p.start_date?.slice(0, 7)).filter(Boolean))].sort(),
    [packages]
  );
  const monthName = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    const a = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
    return `${a[m - 1]} ${y}`;
  };

  const filtered = packages.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (month && p.start_date?.slice(0, 7) !== month) return false;
    if (dur === "kisa" && p.days > 12) return false;
    if (dur === "orta" && (p.days <= 12 || p.days > 20)) return false;
    if (dur === "uzun" && p.days <= 20) return false;
    return true;
  });

  const showFilters = packages.length > 4;
  const sel =
    "cursor-pointer rounded-full border border-cizgi bg-kagit px-5 py-2.5 text-sm font-medium text-cam shadow-kart transition-colors hover:border-altinacik focus:border-altin";

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 border-b border-cizgi pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gri">
          <span className="font-display text-2xl text-cam">{filtered.length}</span>{" "}
          program listeleniyor
        </p>
      {showFilters && (
        <div className="flex flex-wrap gap-3" role="search" aria-label="Paket filtreleri">
          {showCategory && (
            <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori">
              <option value="">Tüm kategoriler</option>
              <option value="umre">Umre</option>
              <option value="hac">Hac</option>
              <option value="kultur">Kültür</option>
            </select>
          )}
          <select className={sel} value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Ay">
            <option value="">Tüm aylar</option>
            {months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
          </select>
          <select className={sel} value={dur} onChange={(e) => setDur(e.target.value)} aria-label="Program süresi">
            <option value="">Tüm süreler</option>
            <option value="kisa">Kısa (12 güne kadar)</option>
            <option value="orta">Orta (13–20 gün)</option>
            <option value="uzun">Uzun (20 günden fazla)</option>
          </select>
        </div>
      )}
      </div>
      {filtered.length === 0 ? (
        <p className="kart p-10 text-center text-gri">
          Bu ölçütlere uygun program bulunamadı. Yaklaşan programlar için lütfen bizimle iletişime geçin.
        </p>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <div key={p.id} className="flex">
              <PackageCard p={p} oncelikli={i < 3} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
