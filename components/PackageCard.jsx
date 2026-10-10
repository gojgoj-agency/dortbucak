import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MoonStar, Sparkle } from "lucide-react";
import { formatDate, formatPrice, hamGorsel, waLink } from "@/lib/site";
import { parseJson } from "@/lib/json";
import { WaIcon } from "./Header";

const quotaText = { var: null, az: "Son kontenjanlar", dolu: "Kontenjan doldu" };

export default function PackageCard({ p, oncelikli = false }) {
  const dortlu = formatPrice(p.price_quad, p.currency);
  const price = dortlu || formatPrice(p.price_triple ?? p.price_double, p.currency);
  const highlights = parseJson(p.highlights).slice(0, 3);
  const quota = quotaText[p.quota_status];

  return (
    <article className="kart-etkili grup-yakinlas group flex flex-col overflow-hidden">
      <div className="relative p-4 pb-0">
        {/* Kemer çerçeve — sitenin imza ögesi; içinde gerçek fotoğraf */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-camderin ring-1 ring-inset ring-cam/10">
          {p.cover_image && (
            <Image
              src={p.cover_image}
              alt={p.name}
              fill
              priority={oncelikli}
              unoptimized={hamGorsel(p.cover_image)}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
              className="gorsel-yakinlas object-cover"
            />
          )}
          {/* Alttan yumuşak karartma: rozetler ve kemer kenarı net okunsun */}
          <div className="perde-kart" aria-hidden />
        </div>

        <span className="absolute left-7 top-7 bg-fildisi/95 px-3 py-1 text-sm font-semibold text-cam shadow-sm backdrop-blur-sm">
          {p.category === "hac" ? "Hac" : "Umre"}
        </span>
        {quota && (
          <span
            className={`absolute right-7 top-7 px-3 py-1 text-sm font-semibold shadow-sm ${
              p.quota_status === "dolu" ? "bg-murekkep/85 text-fildisi" : "bg-altin text-white"
            }`}
          >
            {quota}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {p.label && <span className="etiket self-start">{p.label}</span>}

        <h3 className="text-xl leading-snug">
          <Link
            href={`/paket/${p.slug}`}
            className="transition-colors duration-300 hover:text-camacik"
          >
            {p.name}
          </Link>
        </h3>

        <p className="flex items-center gap-2 text-gri">
          <CalendarDays className="h-4 w-4 shrink-0 text-altin" aria-hidden />
          {p.start_date
            ? `${formatDate(p.start_date)} – ${formatDate(p.end_date)}`
            : p.days
              ? `${p.days} günlük program`
              : "Tarih için iletişime geçin"}
        </p>

        {(p.nights > 0 || p.days > 0) && (
          <p className="flex items-center gap-2 text-sm font-medium text-cam">
            <MoonStar className="h-4 w-4 shrink-0 text-altin" aria-hidden />
            <span>
              {p.nights} gece · {p.days} gün
              {p.mecca_nights || p.medina_nights ? (
                <> &nbsp;|&nbsp; Mekke {p.mecca_nights} · Medine {p.medina_nights} gece</>
              ) : null}
            </span>
          </p>
        )}

        {highlights.length > 0 && (
          <ul className="space-y-1.5 text-[0.95rem] text-gri">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <Sparkle className="mt-1 h-3.5 w-3.5 shrink-0 text-altin" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto border-t border-cizgi pt-4">
          {price ? (
            <p>
              <span className="text-sm text-gri">{dortlu ? "4 kişilik odada kişi başı" : "Kişi başı"}</span>
              <br />
              <span className="font-display text-2xl text-cam">{price}</span>
            </p>
          ) : (
            <p className="font-medium text-cam">Fiyat bilgisi için iletişime geçin</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/paket/${p.slug}`} className="btn-cam flex-1 !px-4 !py-2.5 text-sm">
            Paketi İncele
          </Link>
          <a
            href={waLink(`Merhaba, ${p.name} hakkında bilgi almak istiyorum.`)}
            target="_blank"
            rel="noopener"
            className="btn-wa flex-1 !px-4 !py-2.5 text-sm"
          >
            <WaIcon className="h-4 w-4" /> Bilgi Al
          </a>
        </div>
      </div>
    </article>
  );
}
