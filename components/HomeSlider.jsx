"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function HomeSlider({ slides }) {
  const azHareket = useAzHareket();
  const tekSlayt = slides.length < 2;

  const [emblaRef, embla] = useEmblaCarousel(
    { loop: !tekSlayt, duration: 34, align: "start" },
    tekSlayt ? [] : [Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [aktif, setAktif] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const guncelle = () => setAktif(embla.selectedScrollSnap());
    guncelle();
    embla.on("select", guncelle);
    return () => { embla.off("select", guncelle); };
  }, [embla]);

  // Eklentiler Embla kurulurken sabitlenir; "hareketi azalt" tercihi sonradan
  // okunduğu için otomatik geçişi burada durduruyoruz.
  useEffect(() => {
    const otomatik = embla?.plugins()?.autoplay;
    if (!otomatik) return;
    if (azHareket) otomatik.stop();
  }, [embla, azHareket]);

  const git = useCallback((i) => embla && embla.scrollTo(i), [embla]);
  const onceki = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const sonraki = useCallback(() => embla && embla.scrollNext(), [embla]);

  if (!slides.length) return null;

  return (
    <section aria-label="Tanıtım" aria-roledescription="carousel" className="relative bg-camgece text-fildisi">
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
              {/* Arka plan görseli — masaüstü/mobil için ayrı kırpma */}
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
                      aktif === i && !azHareket ? "animate-kenburns" : "scale-[1.06]"
                    }`}
                  />
                </picture>
              </div>

              {/* Katmanlı karartma: metnin her görselde okunur kalmasını sağlar */}
              <div className="perde" aria-hidden />
              <div className="pointer-events-none absolute inset-0 bg-vinyet" aria-hidden />

              <div className="site-container relative flex min-h-[32rem] flex-col items-center justify-center py-24 text-center md:min-h-[40rem] lg:min-h-[44rem]">
                {aktif === i && (
                  /* Belirme animasyonu CSS ile yapılır: ilk boyamada başlar, JS'in
                     yüklenmesini beklemez — başlık hiçbir zaman görünmez kalmaz.
                     key, slayt değişince animasyonların baştan çalışmasını sağlar. */
                  <div key={`${s.id}-${aktif}`} className="relative isolate flex w-full max-w-3xl flex-col items-center">
                    <div className="slider-hale" aria-hidden />
                    <div className="relative z-10 flex flex-col items-center">
                      {s.kicker && (
                        <p className="slider-kicker mb-5 flex animate-belir items-center gap-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] sm:text-sm">
                          <span className="h-px w-8 bg-gradient-to-r from-transparent to-altinacik sm:w-10" aria-hidden />
                          {s.kicker}
                          <span className="h-px w-8 bg-gradient-to-l from-transparent to-altinacik sm:w-10" aria-hidden />
                        </p>
                      )}

                      <h1
                        className="slider-baslik max-w-[18ch] animate-belir text-balance font-display text-[2.05rem] leading-[1.2] sm:max-w-[16ch] sm:text-[2.7rem] md:text-5xl lg:text-[3.25rem]"
                        style={{ animationDelay: "90ms" }}
                      >
                        {s.title}
                      </h1>

                      <div className="baslik-cizgi animate-belir" style={{ animationDelay: "160ms" }} aria-hidden />

                      {s.description && (
                        <p
                          className="slider-aciklama mt-5 max-w-md animate-belir text-base leading-relaxed sm:max-w-lg sm:text-lg"
                          style={{ animationDelay: "230ms" }}
                        >
                          {s.description}
                        </p>
                      )}

                      {s.button_text && s.button_link && (
                        <Link
                          href={s.button_link}
                          className="btn-cam-uzeri mt-8 animate-belir"
                          style={{ animationDelay: "310ms" }}
                        >
                          {s.button_text}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yan oklar — imleçli cihazlar için; mobilde parmakla kaydırma var */}
      {!tekSlayt && (
        <>
          <OkDugme yon="sol" onClick={onceki} />
          <OkDugme yon="sag" onClick={sonraki} />
        </>
      )}

      {/* Alt göstergeler */}
      {!tekSlayt && (
        <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 md:bottom-20">
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => git(k)}
              aria-label={`${k + 1}. görsele geç`}
              aria-current={k === aktif}
              className={`h-1.5 rounded-full transition-all duration-500 ease-yumusak ${
                k === aktif ? "w-10 bg-altinacik" : "w-1.5 bg-fildisi/45 hover:bg-fildisi/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Aşağı kaydırma ipucu */}
      <div className="pointer-events-none absolute bottom-16 right-6 z-20 hidden lg:block" aria-hidden>
        <ChevronDown className="h-6 w-6 animate-sekmele text-fildisi/45" />
      </div>
    </section>
  );
}

function OkDugme({ yon, onClick }) {
  const Ikon = yon === "sol" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={yon === "sol" ? "Önceki görsel" : "Sonraki görsel"}
      className={`absolute top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-fildisi/25 bg-camgece/25 p-3 text-fildisi/80 backdrop-blur-sm transition-all duration-300 ease-yumusak hover:border-altinacik/70 hover:bg-camgece/55 hover:text-altinparlak md:block ${
        yon === "sol" ? "left-5" : "right-5"
      }`}
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
