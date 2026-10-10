"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
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
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  const wa = waLink("Merhaba");

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-camgece text-fildisi/80 md:hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-altinacik to-transparent" aria-hidden />
        <a href={telLink()} className="flex h-8 items-center justify-center gap-1.5 text-[0.75rem] tracking-wide">
          <Phone className="h-3.5 w-3.5 text-altinacik" aria-hidden />
          {site.phone}
        </a>
      </div>

      <div className="relative hidden bg-camgece text-[0.78rem] text-fildisi/75 md:block">
        <div className="h-px bg-gradient-to-r from-transparent via-altinacik to-transparent" aria-hidden />
        <div className="site-container flex h-10 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              Keçiören, Ankara
            </span>
            <span className="hidden h-3 w-px bg-fildisi/20 xl:block" aria-hidden />
            <span className="hidden items-center gap-1.5 whitespace-nowrap xl:inline-flex">
              <Clock className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              {site.hours}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-4">
            <a href={telLink()} className="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-altinacik">
              <Phone className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-altinacik">
              <Mail className="h-3.5 w-3.5 shrink-0 text-altinacik" aria-hidden />
              <span className="truncate">{site.email}</span>
            </a>
            <span className="h-4 w-px bg-fildisi/15" aria-hidden />
            <SocialLinks tone="bar" />
          </div>
        </div>
      </div>

      <div className="border-b border-cizgi/90 bg-fildisi shadow-[0_12px_40px_-28px_rgba(18,28,51,.7)]">
        <div className="site-container flex h-[4.5rem] items-center justify-between gap-3 lg:h-[4.75rem]">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Ana menü">
            {links.map(([href, label, kisa]) => {
              const aktif = path === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={aktif ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.78rem] font-medium tracking-wide transition-colors xl:px-3 xl:text-[0.84rem] ${
                    aktif ? "bg-cam text-fildisi" : "text-gri hover:bg-cam/[0.06] hover:text-cam"
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
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa hidden !px-3.5 !py-2 text-sm lg:inline-flex"
            >
              <WaIcon className="h-4 w-4" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cizgi bg-kagit text-cam lg:hidden"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Menüyü aç/kapat"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto border-t border-cizgi bg-fildisi shadow-kartust lg:hidden" aria-label="Mobil menü">
          <div className="site-container flex flex-col py-3">
            {links.map(([href, label]) => {
              const aktif = path === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 text-base ${
                    aktif ? "bg-cam font-semibold text-fildisi" : "text-murekkep hover:bg-kagit"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa my-4">
              <WaIcon /> WhatsApp&apos;tan Bilgi Al
            </a>
            <div className="mb-3 flex flex-col gap-2 text-sm text-gri">
              <a href={telLink()} className="inline-flex items-center gap-2 hover:text-cam">
                <Phone className="h-4 w-4 text-altin" aria-hidden /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-cam">
                <Mail className="h-4 w-4 text-altin" aria-hidden /> {site.email}
              </a>
            </div>
            <SocialLinks tone="light" className="mb-3" />
          </div>
        </nav>
      )}
    </header>
  );
}
