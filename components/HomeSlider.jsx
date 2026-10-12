"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { waLink } from "@/lib/site";
import { WaIcon } from "@/components/SocialLinks";

const GECIS_SURESI = 7000;

export default function HomeSlider({ slides }) {
  const azHareket = useAzHareket();
  const tekSlayt = slides.length < 2;

  const [emblaRef, embla] = useEmblaCarousel(
    { loop: !tekSlayt, duration: 38, align: "start" },
    tekSlayt ? [] : [Autoplay({ delay: GECIS_SURESI, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [aktif, setAktif] = useState(0);
  // İlerleme çubuğu, otomatik geçişin zamanlayıcısıyla eş çalışsın diye
  // eklentinin kendi olaylarını dinliyoruz.
  const [tur, setTur] = useState(0);
  const [oynuyor, setOynuyor] = useState(!tekSlayt);

  useEffect(() => {
    if (!embla) return;
    const sec = () => setAktif(embla.selectedScrollSnap());
    const basla = () => { setTur((t) => t + 1); setOynuyor(true); };
    const dur = () => setOynuyor(false);
    sec();
    embla.on("select", sec);
    embla.on("autoplay:timerset", basla);
    embla.on("autoplay:timerstopped", dur);
    return () => {
      embla.off("select", sec);
      embla.off("autoplay:timerset", basla);
      embla.off("autoplay:timerstopped", dur);
    };
  }, [embla]);

  useEffect(() => {
    const otomatik = embla?.plugins()?.autoplay;
    if (otomatik && azHareket) otomatik.stop();
  }, [embla, azHareket]);

  const git = useCallback((i) => embla && embla.scrollTo(i), [embla]);
  const onceki = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const sonraki = useCallback(() => embla && embla.scrollNext(), [embla]);

  if (!slides.length) return null;

  const sayi = (n) => String(n).padStart(2, "0");

  return (
    <section
      aria-label="Tanıtım"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden bg-camgece text-fildisi"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="relative min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <picture>
                  <source media="(min-width: 768px)" srcSet={s.image_desktop} />
                  <img
                    src={s.image_mobile || s.image_desktop}
                    alt=""
                    aria-hidden="true"
                    fetchPriority={i === 0 ? "high" : "auto"}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={`h-full w-full object-cover ${
                      aktif === i && !azHareket ? "animate-kenburns" : "scale-[1.04]"
                    }`}
                  />
                </picture>
              </div>

              <div className="perde md:hidden" aria-hidden />
              <div className="pointer-events-none absolute inset-0 hidden bg-hero-yan md:block" aria-hidden />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-camgece to-transparent" aria-hidden />
              <div className="desen pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 opacity-60 [mask-image:linear-gradient(90deg,#000,transparent)] md:block" aria-hidden />

              <div className="site-container relative flex min-h-[38rem] flex-col justify-center pb-40 pt-20 sm:min-h-[42rem] lg:min-h-[calc(100svh-5.25rem-2.5rem)] lg:max-h-[56rem] lg:pb-44">
                {aktif === i && (
                  /* Belirme CSS ile yapılır; JS beklenmez. key slayt değişince
                     animasyonu baştan çalıştırır. */
                  <div key={`${s.id}-${aktif}`} className="relative max-w-2xl text-center md:text-left">
                    {s.kicker && (
                      <p className="slider-kicker kicker-acik animate-belir !text-[#E7D3A8]">{s.kicker}</p>
                    )}

                    <h1
                      className="slider-baslik mt-6 animate-belir text-balance font-display text-[2.4rem] leading-[1.08] sm:text-[3.1rem] md:text-[3.6rem] lg:text-[4.25rem]"
                      style={{ animationDelay: "120ms" }}
                    >
                      {s.title}
                    </h1>

                    {s.description && (
                      <p
                        className="slider-aciklama mx-auto mt-6 max-w-xl animate-belir text-base leading-relaxed sm:text-lg md:mx-0"
                        style={{ animationDelay: "240ms" }}
                      >
                        {s.description}
                      </p>
                    )}

                    <div
                      className="mt-9 flex animate-belir flex-wrap justify-center gap-3 md:justify-start"
                      style={{ animationDelay: "360ms" }}
                    >
                      {s.button_text && s.button_link && (
                        <Link href={s.button_link} className="btn-altin group">
                          {s.button_text}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                        </Link>
                      )}
                      <a
                        href={waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cam-uzeri"
                      >
                        <WaIcon className="h-4 w-4" /> Danışmana Sorun
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!tekSlayt && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-20 sm:bottom-32">
          <div className="site-container flex items-end justify-between gap-6">
            {/* Bölümlü ilerleme göstergesi */}
            <div className="pointer-events-auto flex w-full max-w-md items-center gap-3">
              {slides.map((s, k) => (
                <button
                  key={s.id}
                  onClick={() => git(k)}
                  aria-label={`${k + 1}. görsele geç`}
                  aria-current={k === aktif}
                  className="group flex-1 py-3 text-left"
                >
                  <span
                    className={`mb-2 block font-display text-sm transition-colors ${
                      k === aktif ? "text-altinparlak" : "text-fildisi/45 group-hover:text-fildisi/80"
                    }`}
                  >
                    {sayi(k + 1)}
                  </span>
                  <span className="relative block h-px w-full overflow-hidden bg-white/20">
                    {k === aktif && (
                      <span
                        key={`${aktif}-${tur}`}
                        className={`absolute inset-0 origin-left bg-altin-gradyan ${
                          azHareket || !oynuyor ? "" : "animate-ilerle"
                        }`}
                        style={{ animationDuration: `${GECIS_SURESI}ms` }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="pointer-events-auto hidden shrink-0 items-center gap-2 md:flex">
              <OkDugme yon="sol" onClick={onceki} />
              <OkDugme yon="sag" onClick={sonraki} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function OkDugme({ yon, onClick }) {
  const Ikon = yon === "sol" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={yon === "sol" ? "Önceki görsel" : "Sonraki görsel"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-fildisi/85 backdrop-blur-md transition-all duration-300 ease-yumusak hover:border-altinacik hover:bg-altinacik hover:text-camgece"
    >
      <Ikon className="h-5 w-5" />
    </button>
  );
}

/** Kullanıcı "hareketi azalt" dediyse otomatik geçişi kapatırız. */
function useAzHareket() {
  const [az, setAz] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const uygula = () => setAz(mq.matches);
    uygula();
    mq.addEventListener("change", uygula);
    return () => mq.removeEventListener("change", uygula);
  }, []);
  return az;
}
