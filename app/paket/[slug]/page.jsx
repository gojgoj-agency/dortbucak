import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Hotel,
  Landmark,
  Minus,
  MoonStar,
  Phone,
  PlaneLanding,
  PlaneTakeoff,
  Sparkle,
  Users,
} from "lucide-react";
import { getPackageBySlug, getPackages, parseJson } from "@/lib/db";
import { formatDate, formatPrice, hamGorsel, waLink, telLink, site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { abs, agencyId, breadcrumbLd, sayfaMeta } from "@/lib/seo";
import { WaIcon } from "@/components/Header";
import PackageCard from "@/components/PackageCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = await getPackageBySlug(params.slug);
  if (!p) return {};
  const tur = p.category === "hac" ? "hac turu" : "umre turu";
  const title = p.seo_title || `${p.name} | ${p.nights} Gece ${p.days} Gün`;
  const description =
    p.seo_desc ||
    `${p.name}: ${p.days ? `${p.days} gün` : "program"}, Mekke ve Medine konaklamalı ${tur}. Kayıt için Dört Bucak Tur.`;
  return sayfaMeta({
    title,
    description,
    path: `/paket/${p.slug}`,
    images: p.cover_image ? [p.cover_image] : [],
  });
}

function Bolum({ kicker, title, children, id }) {
  return (
    <section id={id} className="scroll-mt-36 rounded-3xl border border-cizgi bg-kagit p-6 shadow-kart sm:p-8">
      <p className="kicker">{kicker}</p>
      <h2 className="mt-2 text-2xl md:text-[1.7rem]">{title}</h2>
      <div className="mt-3 h-px w-16 bg-gradient-to-r from-altin to-transparent" />
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function PackageDetail({ params }) {
  const p = await getPackageBySlug(params.slug);
  if (!p || !p.active) notFound();

  const gallery = parseJson(p.gallery).filter((g) => g && g !== p.cover_image);
  const highlights = parseJson(p.highlights);
  const included = parseJson(p.included);
  const excluded = parseJson(p.excluded);
  const itinerary = parseJson(p.itinerary);
  const documents = parseJson(p.documents);
  const waMsg = `Merhaba, ${p.name} hakkında bilgi almak istiyorum.`;
  const categoryHref = p.category === "hac" ? "/hac-turlari" : "/umre-turlari";
  const categoryName = p.category === "hac" ? "Hac Turları" : "Umre Turları";

  const rooms = [
    ["2 kişilik oda", p.price_double],
    ["3 kişilik oda", p.price_triple],
    ["4 kişilik oda", p.price_quad],
  ].map(([label, value]) => ({ label, value, text: formatPrice(value, p.currency) }));

  const priced = rooms.filter((r) => r.text);
  const from = priced.reduce(
    (best, row) => (Number(row.value) < Number(best.value) ? row : best),
    priced[0]
  );
  const lowest = priced.length > 1 ? Math.min(...priced.map((r) => Number(r.value))) : null;

  const hizmetler = [
    p.transport_info && { icon: PlaneTakeoff, title: "Ulaşım", text: p.transport_info },
    p.lodging_info && { icon: Hotel, title: "Konaklama", text: p.lodging_info },
    p.guide_info && { icon: Users, title: "Rehberlik", text: p.guide_info },
  ].filter(Boolean);

  const related = (await getPackages({ category: p.category }))
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3);

  const fiyatlar = [p.price_double, p.price_triple, p.price_quad].map(Number).filter((n) => n > 0);
  const sayfa = abs(`/paket/${p.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([
        ["Ana Sayfa", "/"],
        [categoryName, categoryHref],
        [p.name, `/paket/${p.slug}`],
      ]),
      {
        "@type": "TouristTrip",
        name: p.name,
        description: p.short_desc || p.long_desc,
        url: sayfa,
        ...(p.cover_image ? { image: abs(p.cover_image) } : {}),
        touristType: p.category === "hac" ? "Hac" : "Umre",
        ...(p.start_date ? { startDate: p.start_date } : {}),
        ...(p.end_date ? { endDate: p.end_date } : {}),
        itinerary: {
          "@type": "ItemList",
          itemListElement: itinerary.map((step, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: step,
          })),
        },
        provider: { "@id": agencyId() },
        ...(fiyatlar.length
          ? {
              offers: {
                "@type": "AggregateOffer",
                lowPrice: Math.min(...fiyatlar),
                highPrice: Math.max(...fiyatlar),
                priceCurrency: p.currency || "USD",
                availability:
                  p.quota_status === "dolu"
                    ? "https://schema.org/SoldOut"
                    : "https://schema.org/InStock",
                url: sayfa,
                seller: { "@id": agencyId() },
              },
            }
          : {}),
      },
    ],
  };

  const ozet = [
    ...(p.start_date
      ? [
          { icon: PlaneTakeoff, etiket: "Gidiş", deger: formatDate(p.start_date) || "—" },
          { icon: PlaneLanding, etiket: "Dönüş", deger: formatDate(p.end_date) || "—" },
        ]
      : [{ icon: CalendarDays, etiket: "Dönem", deger: p.label || "Tarih için sorun" }]),
    {
      icon: Clock,
      etiket: "Süre",
      deger: p.days || p.nights ? `${p.nights} gece · ${p.days} gün` : "Bilgi için sorun",
    },
    {
      icon: Landmark,
      etiket: "Konaklama",
      deger:
        p.mecca_nights || p.medina_nights
          ? `Mekke ${p.mecca_nights} · Medine ${p.medina_nights}`
          : "Mekke ve Medine",
    },
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />
      <style dangerouslySetInnerHTML={{ __html: "@media (max-width:1023px){body{padding-bottom:4.75rem}}" }} />

      <section className="relative isolate min-h-[28rem] overflow-hidden bg-camgece lg:min-h-[36rem]">
        {p.cover_image && (
          <Image
            src={p.cover_image}
            alt=""
            fill
            priority
            unoptimized={hamGorsel(p.cover_image)}
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="detay-perde pointer-events-none absolute inset-0" />

        <div className="site-container relative flex min-h-[28rem] flex-col justify-end pb-20 pt-8 lg:min-h-[36rem] lg:pb-24">
          <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-fildisi/80">
            <Link href="/" className="transition-colors hover:text-altinparlak">Ana Sayfa</Link>
            <ChevronRight className="h-3.5 w-3.5 text-altinacik/80" aria-hidden />
            <Link href={categoryHref} className="transition-colors hover:text-altinparlak">{categoryName}</Link>
            <ChevronRight className="h-3.5 w-3.5 text-altinacik/80" aria-hidden />
            <span className="text-altinparlak">{p.name}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-fildisi/95 px-3 py-1 text-sm font-semibold text-cam shadow-sm">
              {p.category === "hac" ? "Hac" : "Umre"}
            </span>
            {p.label && <span className="etiket !border-altinacik/40 !bg-altin/20 !text-altinparlak">{p.label}</span>}
            {p.quota_status === "az" && (
              <span className="rounded-full bg-altin px-3 py-1 text-sm font-semibold text-white">Son kontenjanlar</span>
            )}
            {p.quota_status === "dolu" && (
              <span className="rounded-full bg-murekkep/90 px-3 py-1 text-sm font-semibold text-fildisi">Kontenjan doldu</span>
            )}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl leading-tight !text-fildisi md:text-5xl">{p.name}</h1>
          {p.short_desc && (
            <p className="olcu mt-4 text-base text-fildisi/85 md:text-lg">{p.short_desc}</p>
          )}
        </div>
      </section>

      <div className="site-container relative z-10 -mt-10">
        <dl className="grid gap-px overflow-hidden rounded-3xl border border-cizgi bg-cizgi shadow-kartust sm:grid-cols-2 lg:grid-cols-4">
          {ozet.map(({ icon: Icon, etiket, deger }) => (
            <div key={etiket} className="flex gap-3 bg-kagit px-5 py-5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cam text-altinacik">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <dt className="text-xs font-bold uppercase tracking-kicker text-altin">{etiket}</dt>
                <dd className="mt-0.5 font-display text-lg leading-snug text-cam">{deger}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21.5rem]">
          <div className="order-2 space-y-8 lg:order-1">
            {highlights.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl border border-cizgi bg-kagit px-4 py-4 shadow-kart">
                    <Sparkle className="mt-0.5 h-4 w-4 shrink-0 text-altin" aria-hidden />
                    <span className="text-sm font-medium leading-snug text-cam">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {p.long_desc && (
              <Bolum id="program" kicker="Program" title="Bu yolculukta sizi neler bekliyor">
                <p className="olcu whitespace-pre-line text-gri">{p.long_desc}</p>
              </Bolum>
            )}

            <Bolum id="fiyatlar" kicker="Fiyat" title="Oda tipine göre kişi başı">
              {priced.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {rooms.map((room) => {
                    const uygun = lowest !== null && Number(room.value) === lowest && room.text;
                    return (
                      <div
                        key={room.label}
                        className={`rounded-2xl border px-4 py-5 ${
                          uygun
                            ? "border-altin/45 bg-altin/[0.07] shadow-altinhale"
                            : "border-cizgi bg-fildisi"
                        }`}
                      >
                        <BedDouble className={`h-5 w-5 ${uygun ? "text-altin" : "text-camacik"}`} aria-hidden />
                        <p className="mt-3 text-sm text-gri">{room.label}</p>
                        <p className="mt-1 font-display text-2xl leading-none text-cam">
                          {room.text || "—"}
                        </p>
                        <p className="mt-2 text-xs text-gri">
                          {room.text ? (uygun ? "En uygun kişi başı" : "Kişi başı") : "Bilgi için sorun"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-medium text-cam">Fiyat bilgisi için iletişime geçin.</p>
              )}
              <p className="mt-4 text-sm text-gri">
                Fiyatlar kişi başıdır ve oda paylaşımına göre değişir. Güncel tutar ve kayıt şartları için bize yazın.
              </p>
            </Bolum>

            {itinerary.length > 0 && (
              <Bolum id="akis" kicker="Akış" title="Program gün gün">
                <ol>
                  {itinerary.map((step, i) => (
                    <li key={i} className="relative flex gap-4 pb-7 last:pb-0">
                      {i < itinerary.length - 1 && (
                        <span className="absolute bottom-0 left-[1.05rem] top-10 w-px bg-gradient-to-b from-altin/70 to-cizgi" aria-hidden />
                      )}
                      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cam font-display text-sm text-altinacik ring-4 ring-kagit">
                        {i + 1}
                      </span>
                      <div className="pt-1.5">
                        <p className="text-[0.68rem] font-bold uppercase tracking-kicker text-altin">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-1 leading-snug text-murekkep">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Bolum>
            )}

            {(included.length > 0 || excluded.length > 0) && (
              <div id="dahil" className="scroll-mt-36 grid gap-4 sm:grid-cols-2">
                {included.length > 0 && (
                  <section className="rounded-3xl border border-cizgi bg-kagit p-6 shadow-kart sm:p-7">
                    <p className="kicker">Dahil</p>
                    <h2 className="mt-2 text-2xl">Pakete dahil</h2>
                    <ul className="mt-5 space-y-3">
                      {included.map((item, i) => (
                        <li key={i} className="flex gap-3 text-murekkep">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cam text-altinacik">
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {excluded.length > 0 && (
                  <section className="rounded-3xl border border-cizgi bg-kagit p-6 shadow-kart sm:p-7">
                    <p className="kicker">Hariç</p>
                    <h2 className="mt-2 text-2xl">Dahil olmayan</h2>
                    <ul className="mt-5 space-y-3">
                      {excluded.map((item, i) => (
                        <li key={i} className="flex gap-3 text-gri">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cizgi text-gri">
                            <Minus className="h-3 w-3" aria-hidden />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {hizmetler.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {hizmetler.map(({ icon: Icon, title, text }) => (
                  <section key={title} className="rounded-3xl border border-cizgi bg-kagit p-6 shadow-kart">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cam text-altinacik">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="mt-4 text-xl">{title}</h2>
                    <p className="mt-2 whitespace-pre-line text-sm text-gri">{text}</p>
                  </section>
                ))}
              </div>
            )}

            {documents.length > 0 && (
              <Bolum id="belgeler" kicker="Hazırlık" title="Gerekli belgeler">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {documents.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-2xl bg-fildisi px-4 py-3 text-sm text-murekkep">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-altin" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Bolum>
            )}

            {p.notes && (
              <section className="rounded-3xl border border-altin/30 bg-altin/[0.08] p-6 sm:p-8">
                <p className="kicker">Not</p>
                <h2 className="mt-2 text-2xl">Önemli açıklamalar</h2>
                <p className="mt-4 whitespace-pre-line text-gri">{p.notes}</p>
              </section>
            )}

            {gallery.length > 0 && (
              <Bolum kicker="Görseller" title="Programdan kareler">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((src, i) => (
                    <div key={src} className="kemer relative aspect-[4/3] bg-cam ring-1 ring-inset ring-cam/10">
                      <Image src={src} alt={`${p.name} görseli ${i + 1}`} fill sizes="280px" unoptimized={hamGorsel(src)} className="object-cover" />
                    </div>
                  ))}
                </div>
              </Bolum>
            )}
          </div>

          <aside className="order-1 lg:sticky lg:top-28 lg:order-2">
            <div className="overflow-hidden rounded-3xl border border-cizgi bg-kagit shadow-kartust">
              <div className="doku relative overflow-hidden bg-camderin px-6 py-6 text-fildisi">
                <div className="relative">
                  <p className="kicker-acik">{from ? "Kişi başı başlangıç" : "Fiyat"}</p>
                  <p className="mt-2 font-display text-4xl leading-none !text-fildisi">
                    {from ? from.text : "Bilgi alın"}
                  </p>
                  <p className="mt-2 text-sm text-fildisi/75">
                    {from ? `${from.label} üzerinden` : "Güncel fiyat için bize yazın"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {priced.length > 0 && (
                  <ul className="space-y-2.5">
                    {rooms.map((room) => (
                      <li key={room.label} className="flex items-baseline justify-between gap-3 border-b border-cizgi/80 pb-2.5 text-sm last:border-0 last:pb-0">
                        <span className="text-gri">{room.label}</span>
                        <span className="font-display text-lg text-cam">{room.text || "Sorunuz"}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-2 text-sm text-cam">
                  <MoonStar className="h-4 w-4 shrink-0 text-altin" aria-hidden />
                  <span>{p.nights} gece · {p.days} gün</span>
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  <a href={waLink(waMsg)} target="_blank" rel="noopener" className="btn-altin w-full">
                    <WaIcon /> WhatsApp&apos;tan Bilgi Al
                  </a>
                  <a href={telLink()} className="btn-cerceve w-full">
                    <Phone className="h-4 w-4" aria-hidden /> Telefonla arayın
                  </a>
                  {p.pdf_file && (
                    <a href={p.pdf_file} target="_blank" rel="noopener" className="btn-cerceve w-full">
                      <Download className="h-4 w-4" aria-hidden /> Program dosyası (PDF)
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="site-container mt-20" aria-labelledby="diger-programlar">
          <p className="kicker">Aynı kategoride</p>
          <h2 id="diger-programlar" className="mt-2 text-2xl md:text-3xl">Diğer programlar</h2>
          <div className="mt-4 h-px w-24 bg-altin-cizgi" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <PackageCard key={item.slug} p={item} />
            ))}
          </div>
        </section>
      )}

      <section className="site-container mt-16 mb-16" aria-labelledby="paket-cagri">
        <div className="doku relative overflow-hidden rounded-[2rem] bg-camgece px-7 py-16 text-center text-fildisi shadow-derin">
          <div className="relative">
            <p className="kicker-acik">Kayıt</p>
            <h2 id="paket-cagri" className="mt-3 text-2xl !text-fildisi md:text-3xl">
              Bu program hakkında konuşalım
            </h2>
            <div className="baslik-cizgi" />
            <p className="olcu mx-auto mt-5 text-fildisi/80">
              Tarih, kontenjan ve oda tipi için size en güncel bilgiyi verelim. Sorularınızı kayıt öncesinde yanıtlarız.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={waLink(waMsg)} target="_blank" rel="noopener" className="btn-altin">
                <WaIcon /> WhatsApp&apos;tan Bilgi Al
              </a>
              <a href={telLink()} className="btn-cam-uzeri">
                <Phone className="h-4 w-4" aria-hidden /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cizgi bg-kagit/95 px-4 py-3 shadow-kartust backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-bold uppercase tracking-kicker text-altin">
              {from ? "Başlangıç" : "Fiyat"}
            </p>
            <p className="truncate font-display text-xl leading-tight text-cam">
              {from ? from.text : "Bilgi için sorun"}
            </p>
          </div>
          <a href={waLink(waMsg)} target="_blank" rel="noopener" className="btn-altin shrink-0 !px-4 !py-2.5 text-sm">
            <WaIcon className="h-4 w-4" /> Bilgi Al
          </a>
        </div>
      </div>
    </div>
  );
}
