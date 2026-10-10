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
  const sel = "rounded-lg border border-cizgi bg-kagit px-3 py-2 text-base";

  return (
    <div>
      {showFilters && (
        <div className="mb-8 flex flex-wrap gap-3" role="search" aria-label="Paket filtreleri">
          {showCategory && (
            <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori">
              <option value="">Hac / Umre</option>
              <option value="hac">Hac</option>
              <option value="umre">Umre</option>
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
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-cizgi bg-kagit p-8 text-center text-gri">
          Bu ölçütlere uygun program bulunamadı. Yaklaşan programlar için lütfen bizimle iletişime geçin.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <PackageCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
