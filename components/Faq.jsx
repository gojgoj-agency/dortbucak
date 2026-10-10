"use client";
export default function Faq({ items }) {
  return (
    <div className="divide-y divide-cizgi overflow-hidden rounded-2xl border border-cizgi bg-kagit shadow-kart">
      {items.map(([q, a], i) => (
        <details key={i} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-cam">
            {q}
            <span aria-hidden className="text-altin transition-transform group-open:rotate-45">＋</span>
          </summary>
          <p className="mt-3 text-gri">{a}</p>
        </details>
      ))}
    </div>
  );
}
