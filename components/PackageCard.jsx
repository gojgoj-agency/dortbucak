import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Check, MoonStar } from "lucide-react";
import { formatDate, formatPrice, hamGorsel, kategoriBilgi, waLink } from "@/lib/site";
import { parseJson } from "@/lib/json";
import { WaIcon } from "./SocialLinks";

const quotaText = { var: null, az: "Son kontenjanlar", dolu: "Kontenjan doldu" };

export default function PackageCard({ p, oncelikli = false }) {
  const dortlu = formatPrice(p.price_quad, p.currency);
  const price = dortlu || formatPrice(p.price_triple ?? p.price_double, p.currency);
  const highlights = parseJson(p.highlights).slice(0, 3);
  const quota = quotaText[p.quota_status];
  const href = `/paket/${p.slug}`;
  const etiket = kategoriBilgi(p.category).etiket;

  const tarih = p.start_date
    ? `${formatDate(p.start_date)} – ${formatDate(p.end_date)}`
    : p.label || "Tarih için iletişime geçin";

  return (
    <article className="grup-yakinlas group relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-cizgi bg-kagit shadow-kart transition-all duration-500 ease-yumusak hover:-translate-y-2 hover:border-altinacik/60 hover:shadow-kartust">
      {/* Görsel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-camderin">
        {p.cover_image && (
          <Image
            src={p.cover_image}
            alt={p.name}
            fill
            priority={oncelikli}
            unoptimized={hamGorsel(p.cover_image)}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px"
            className="gorsel-yakinlas object-cover"
          />
        )}
        <div className="perde-kart" aria-hidden />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-camgece/45 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-altinparlak backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-altinacik" aria-hidden />
            {etiket}
          </span>
          {quota && (
            <span
              className={`rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] shadow-sm ${
                p.quota_status === "dolu" ? "bg-murekkep/85 text-fildisi" : "bg-altin-gradyan text-camgece"
              }`}
            >
              {quota}
            </span>
          )}
        </div>

        <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
          {(p.nights > 0 || p.days > 0) ? (
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <MoonStar className="h-4 w-4 text-altinacik" aria-hidden />
              {p.days} gün · {p.nights} gece
            </p>
          ) : <span />}
          {p.label && (
            <span className="rounded-full bg-white/90 px-3 py-0.5 text-xs font-semibold text-cam">{p.label}</span>
          )}
        </div>
      </div>

      {/* İçerik */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-[1.35rem] leading-snug">
          <Link href={href} className="transition-colors duration-300 after:absolute after:inset-0 hover:text-camacik">
            {p.name}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-gri">
          <CalendarDays className="h-4 w-4 shrink-0 text-altin" aria-hidden />
          {tarih}
        </p>

        {(p.mecca_nights > 0 || p.medina_nights > 0) && (
          <dl className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-cizgi bg-fildisi/70 text-center">
            <div className="px-3 py-3">
              <dt className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-altin">Mekke</dt>
              <dd className="mt-0.5 font-display text-lg text-cam">{p.mecca_nights} gece</dd>
            </div>
            <div className="border-l border-cizgi px-3 py-3">
              <dt className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-altin">Medine</dt>
              <dd className="mt-0.5 font-display text-lg text-cam">{p.medina_nights} gece</dd>
            </div>
          </dl>
        )}

        {highlights.length > 0 && (
          <ul className="mt-5 space-y-2 text-[0.92rem] text-gri">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-altin/10 text-altin">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                </span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <div className="h-px bg-gradient-to-r from-cizgi via-altinacik/50 to-cizgi" aria-hidden />
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em] text-gri">
                {price ? (dortlu ? "4 kişilik oda · kişi başı" : "Kişi başı") : "Fiyat"}
              </p>
              <p className="mt-1 font-display text-[1.9rem] leading-none text-cam">
                {price || <span className="text-lg">Bilgi alın</span>}
              </p>
            </div>
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cam text-altinparlak transition-all duration-500 ease-yumusak group-hover:rotate-45 group-hover:bg-altin-gradyan group-hover:text-camgece"
              aria-hidden
            >
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>

          <a
            href={waLink(`Merhaba, ${p.name} hakkında bilgi almak istiyorum.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-5 flex items-center justify-center gap-2 rounded-full border border-cizgi py-2.5 text-sm font-semibold text-cam transition-colors hover:border-[#1D7550] hover:bg-[#1D7550] hover:text-white"
          >
            <WaIcon className="h-4 w-4" /> WhatsApp ile bilgi al
          </a>
        </div>
      </div>
    </article>
  );
}
