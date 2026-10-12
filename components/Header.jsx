"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, telLink, waLink } from "@/lib/site";
import SocialLinks, { WaIcon } from "@/components/SocialLinks";
import Logo from "@/components/Logo";

export { WaIcon };

const links = [
  ["/", "Ana Sayfa"],
  ["/hac-turlari", "Hac Turları"],
  ["/umre-turlari", "Umre Turları"],
  ["/hakkimizda", "Hakkımızda"],
  ["/sss", "Sık Sorulan Sorular", "SSS"],
  ["/iletisim", "İletişim"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [kaydi, setKaydi] = useState(false);
  const path = usePathname();

  useEffect(() => {
    // Eşikler farklı: başlık küçülünce sayfa kaydığı için tek eşik titreme yapar.
    const guncelle = () =>
      setKaydi((once) => (once ? window.scrollY > 8 : window.scrollY > 90));
    guncelle();
    window.addEventListener("scroll", guncelle, { passive: true });
    return () => window.removeEventListener("scroll", guncelle);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (path.startsWith("/admin")) return null;

  const wa = waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.");

  return (
    <header className="sticky top-0 z-50">
      {/* Üst bilgi şeridi */}
      <div
        className={`overflow-hidden bg-camgece text-[0.76rem] text-fildisi/70 transition-[max-height,opacity] duration-500 ease-yumusak ${
          kaydi ? "max-h-0 opacity-0 lg:max-h-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="site-container flex h-10 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <span className="hidden items-center gap-2 whitespace-nowrap md:inline-flex">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              Keçiören, Ankara
            </span>
            <span className="hidden items-center gap-2 whitespace-nowrap xl:inline-flex">
              <Clock className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              {site.hours}
            </span>
            <a href={telLink()} className="inline-flex items-center gap-2 whitespace-nowrap transition-colors hover:text-altinparlak md:hidden">
              <Phone className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              {site.phone}
            </a>
          </div>
          <div className="flex min-w-0 items-center gap-5">
            <a href={`mailto:${site.email}`} className="hidden min-w-0 items-center gap-2 transition-colors hover:text-altinparlak md:inline-flex">
              <Mail className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              <span className="truncate">{site.email}</span>
            </a>
            <span className="hidden h-3.5 w-px bg-white/15 md:block" aria-hidden />
            <SocialLinks tone="bar" />
          </div>
        </div>
      </div>

      {/* Ana menü */}
      <div
        className={`relative border-b transition-all duration-500 ease-yumusak ${
          kaydi
            ? "border-white/[0.06] bg-camderin/[0.92] shadow-[0_18px_40px_-24px_rgba(0,0,0,.8)] backdrop-blur-xl"
            : "border-white/[0.06] bg-camderin"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-altinacik/50 to-transparent" aria-hidden />
        <div
          className={`site-container flex items-center justify-between gap-4 transition-[height] duration-500 ease-yumusak ${
            kaydi ? "h-[6.75rem]" : "h-[8.5rem]"
          }`}
        >
          <Logo boyut={kaydi ? "kucuk" : "orta"} />

          <nav className="hidden items-center lg:flex" aria-label="Ana menü">
            {links.map(([href, label, kisa]) => {
              const aktif = path === href || (href !== "/" && path.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={aktif ? "page" : undefined}
                  className={`group relative whitespace-nowrap px-3 py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors xl:px-4 ${
                    aktif ? "text-altinparlak" : "text-fildisi/75 hover:text-white"
                  }`}
                >
                  {kisa ? (
                    <>
                      <span className="xl:hidden">{kisa}</span>
                      <span className="hidden xl:inline">{label}</span>
                    </>
                  ) : (
                    label
                  )}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-center bg-altin-gradyan transition-transform duration-500 ease-yumusak xl:inset-x-4 ${
                      aktif ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={telLink()}
              className="hidden items-center gap-3 text-left xl:flex"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-altinacik/35 text-altinacik">
                <Phone className="h-4 w-4" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-fildisi/50">Bize ulaşın</span>
                <span className="block text-sm font-semibold text-fildisi">{site.phone}</span>
              </span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-altin hidden !px-5 !py-2.5 text-sm md:inline-flex"
            >
              <WaIcon className="h-4 w-4" />
              Bilgi Al
            </a>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-fildisi transition-colors hover:border-altinacik hover:text-altinparlak lg:hidden"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobil-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M8 12h12M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      <div
        id="mobil-menu"
        className={`fixed inset-x-0 bottom-0 z-40 bg-camgece/98 backdrop-blur-xl transition-all duration-500 ease-yumusak lg:hidden ${
          kaydi ? "top-[6.75rem]" : "top-[11rem]"
        } ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="desen absolute inset-0 opacity-60" aria-hidden />
        <nav className="site-container relative flex h-full flex-col overflow-y-auto py-6" aria-label="Mobil menü">
          {links.map(([href, label], i) => {
            const aktif = path === href || (href !== "/" && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between border-b border-white/[0.07] py-4 font-display text-2xl transition-all duration-500 ease-yumusak ${
                  aktif ? "text-altinparlak" : "text-fildisi/90"
                } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                {label}
                <ArrowUpRight className="h-5 w-5 text-altinacik/70" aria-hidden />
              </Link>
            );
          })}
          <div className="mt-8 grid gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-altin">
              <WaIcon /> WhatsApp&apos;tan Bilgi Al
            </a>
            <a href={telLink()} className="btn-cam-uzeri">
              <Phone className="h-4 w-4" aria-hidden /> {site.phone}
            </a>
          </div>
          <div className="mt-8 space-y-2 text-sm text-fildisi/60">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden /> {site.address}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-altinacik" aria-hidden /> {site.email}
            </p>
          </div>
          <SocialLinks tone="footer" className="mt-6" />
        </nav>
      </div>
    </header>
  );
}
