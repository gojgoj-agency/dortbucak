import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SayfaKapak({
  kicker,
  baslik,
  vurgu,
  aciklama,
  gorsel = "/images/slider-1-masaustu.webp",
  yol = [],
}) {
  return (
    <section className="relative isolate overflow-hidden bg-camgece text-fildisi">
      <Image src={gorsel} alt="" fill priority sizes="100vw" className="-z-10 scale-105 object-cover opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-camgece/70 via-camgece/60 to-camgece" aria-hidden />
      <div className="desen pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" aria-hidden />

      <div className="site-container relative py-20 text-center md:py-28">
        <nav aria-label="Sayfa yolu" className="mb-8 flex flex-wrap items-center justify-center gap-1.5 text-xs uppercase tracking-[0.18em] text-fildisi/55">
          <Link href="/" className="transition-colors hover:text-altinparlak">Ana Sayfa</Link>
          {[...yol, [baslik + (vurgu ? ` ${vurgu}` : "")]].map(([ad, href]) => (
            <span key={ad} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-altinacik/70" aria-hidden />
              {href ? (
                <Link href={href} className="transition-colors hover:text-altinparlak">{ad}</Link>
              ) : (
                <span className="text-altinparlak">{ad}</span>
              )}
            </span>
          ))}
        </nav>
        {kicker && <p className="kicker-acik kicker-orta">{kicker}</p>}
        <h1 className="slider-baslik mx-auto mt-5 max-w-3xl text-[2.6rem] leading-[1.1] md:text-[3.6rem]">
          {baslik}
          {vurgu && (
            <>
              {" "}
              <span className="altin-yazi italic">{vurgu}</span>
            </>
          )}
        </h1>
        {aciklama && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-fildisi/75 sm:text-lg">{aciklama}</p>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-altinacik/60 to-transparent" aria-hidden />
    </section>
  );
}
