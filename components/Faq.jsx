"use client";
export default function Faq({ items }) {
  return (
    <div className="space-y-3">
      {items.map(([q, a], i) => (
        <details
          key={i}
          className="group rounded-[1.1rem] border border-cizgi bg-kagit px-6 py-5 shadow-kart transition-colors duration-300 open:border-altinacik/50"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[1.02rem] font-semibold text-cam [&::-webkit-details-marker]:hidden">
            {q}
            <span
              aria-hidden
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cizgi text-altin transition-all duration-300 group-open:rotate-45 group-open:border-altin group-open:bg-cam group-open:text-altinparlak"
            >
              <span className="absolute h-px w-3 bg-current" />
              <span className="absolute h-3 w-px bg-current" />
            </span>
          </summary>
          <p className="mt-4 border-t border-cizgi/70 pt-4 leading-relaxed text-gri">{a}</p>
        </details>
      ))}
    </div>
  );
}
