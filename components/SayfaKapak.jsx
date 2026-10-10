import Image from "next/image";

export default function SayfaKapak({
  kicker,
  baslik,
  aciklama,
  gorsel = "/images/slider-1-masaustu.webp",
}) {
  return (
    <section className="relative overflow-hidden bg-camgece text-fildisi">
      <Image src={gorsel} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-camgece/80 via-camgece/55 to-camgece/88" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-altinacik/70 to-transparent" aria-hidden />
      <div className="site-container relative px-4 py-16 text-center sm:py-20 md:py-24">
        {kicker && <p className="kicker-acik">{kicker}</p>}
        <h1 className="slider-baslik mx-auto mt-4 max-w-3xl text-4xl md:text-5xl">{baslik}</h1>
        <div className="baslik-cizgi" />
        {aciklama && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fildisi/90 sm:text-lg">{aciklama}</p>
        )}
      </div>
    </section>
  );
}
