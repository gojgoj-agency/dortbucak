"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, telLink, waLink } from "@/lib/site";
import SocialLinks, { WaIcon } from "@/components/SocialLinks";
import Logo from "@/components/Logo";

export { WaIcon };

const turlar = {
  label: "Dört Bucak Turları",
  children: [
    ["/umre-turlari", "Umre"],
    ["/hac-turlari", "Hac"],
    ["/kultur-turlari", "Kültür"],
    ["/kisiye-ozel-turlar", "Özel Turlar"],
  ],
};

const links = [
  { href: "/", label: "Ana Sayfa" },
  turlar,
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/ilkelerimiz", label: "İlkelerimiz" },
  { href: "/sss", label: "Sık Sorulan Sorular", kisa: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

function sayfaAktif(path, href) {
  return path === href || (href !== "/" && path.startsWith(href));
}

function NavLink({ item, path }) {
  const aktif = sayfaAktif(path, item.href);
  return (
    <Link
      href={item.href}
      aria-current={aktif ? "page" : undefined}
      className={`group relative whitespace-nowrap px-2 py-2 text-[0.72rem] font-medium uppercase tracking-[0.1em] transition-colors xl:px-3 xl:text-[0.78rem] xl:tracking-[0.12em] ${
        aktif ? "text-altinparlak" : "text-fildisi/75 hover:text-white"
      }`}
    >
      {item.kisa ? (
        <>
          <span className="2xl:hidden">{item.kisa}</span>
          <span className="hidden 2xl:inline">{item.label}</span>
        </>
      ) : (
        item.label
      )}
      <span
        className={`absolute inset-x-2 -bottom-0.5 h-px origin-center bg-altin-gradyan transition-transform duration-500 ease-yumusak xl:inset-x-3 ${
          aktif ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
        aria-hidden
      />
    </Link>
  );
}

function TurMenu({ item, path }) {
  const [acik, setAcik] = useState(false);
  const kutu = useRef(null);
  const aktif = item.children.some(([href]) => sayfaAktif(path, href));

  useEffect(() => setAcik(false), [path]);

  useEffect(() => {
    if (!acik) return;
    const kapat = (e) => {
      if (!kutu.current?.contains(e.target)) setAcik(false);
    };
    document.addEventListener("pointerdown", kapat);
    return () => document.removeEventListener("pointerdown", kapat);
  }, [acik]);

  return (
    <div
      ref={kutu}
      className="relative"
      onMouseEnter={() => setAcik(true)}
      onMouseLeave={() => setAcik(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setAcik(false);
      }}
    >
      <button
        type="button"
        className={`group relative inline-flex items-center gap-1 whitespace-nowrap px-2 py-2 text-[0.72rem] font-medium uppercase tracking-[0.1em] transition-colors xl:px-3 xl:text-[0.78rem] xl:tracking-[0.12em] ${
          aktif || acik ? "text-altinparlak" : "text-fildisi/75 hover:text-white"
        }`}
        aria-expanded={acik}
        aria-haspopup="true"
        onClick={() => setAcik((v) => !v)}
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${acik ? "rotate-180" : ""}`} aria-hidden />
        <span
          className={`absolute inset-x-2 -bottom-0.5 h-px origin-center bg-altin-gradyan transition-transform duration-500 ease-yumusak xl:inset-x-3 ${
            aktif || acik ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
          aria-hidden
        />
      </button>
      <div className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${acik ? "visible" : "invisible"}`}>
        <div
          className={`min-w-[15.5rem] rounded-2xl border border-white/10 bg-camderin/95 p-2 shadow-derin backdrop-blur-xl transition-all duration-300 ease-yumusak ${
            acik ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          {item.children.map(([href, label]) => {
            const secili = sayfaAktif(path, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={secili ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                  secili ? "bg-white/[0.06] text-altinparlak" : "text-fildisi/80 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function mobilOgeler(liste) {
  const sonuc = [];
  for (const item of liste) {
    if (item.children) {
      sonuc.push({ baslik: true, label: item.label });
      for (const [href, label] of item.children) sonuc.push({ href, label, alt: true });
    } else {
      sonuc.push(item);
    }
  }
  return sonuc;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [kaydi, setKaydi] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const anaSayfaya = (e) => {
    if (e.target.closest("a, button, nav")) return;
    router.push("/");
  };

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
        onClick={anaSayfaya}
        className={`cursor-pointer overflow-hidden bg-camgece text-[0.76rem] text-fildisi/70 transition-[max-height,opacity] duration-500 ease-yumusak ${
          kaydi ? "max-h-0 opacity-0 lg:max-h-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="site-container flex h-10 min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-5">
            <span className="hidden items-center gap-2 whitespace-nowrap md:inline-flex">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-mavi" aria-hidden />
              Ankara
            </span>
            <span className="hidden items-center gap-2 whitespace-nowrap xl:inline-flex">
              <Clock className="h-3.5 w-3.5 shrink-0 text-mavi" aria-hidden />
              {site.hours}
            </span>
            <a href={telLink()} className="inline-flex min-w-0 items-center gap-2 transition-colors hover:text-altinparlak md:hidden">
              <Phone className="h-3.5 w-3.5 shrink-0 text-mavi" aria-hidden />
              <span className="truncate">{site.phone}</span>
            </a>
          </div>
          <div className="flex min-w-0 items-center gap-5">
            <a href={`mailto:${site.email}`} className="hidden min-w-0 items-center gap-2 transition-colors hover:text-altinparlak md:inline-flex">
              <Mail className="h-3.5 w-3.5 shrink-0 text-mavi" aria-hidden />
              <span className="truncate">{site.email}</span>
            </a>
            <span className="hidden h-3.5 w-px bg-white/15 md:block" aria-hidden />
            <SocialLinks tone="bar" className="shrink-0" />
          </div>
        </div>
      </div>

      {/* Ana menü */}
      <div
        onClick={anaSayfaya}
        className={`relative cursor-pointer border-b transition-all duration-500 ease-yumusak ${
          kaydi
            ? "border-white/[0.06] bg-camderin/[0.92] shadow-[0_18px_40px_-24px_rgba(0,0,0,.8)] backdrop-blur-xl"
            : "border-white/[0.06] bg-camderin"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-altinacik/50 to-transparent" aria-hidden />
        <div
          className={`site-container flex items-center justify-between gap-4 transition-[height] duration-500 ease-yumusak ${
            kaydi ? "h-14" : "h-[4.5rem]"
          }`}
        >
          <Logo boyut={kaydi ? "kucuk" : "orta"} />

          <nav className="hidden items-center lg:flex" aria-label="Ana menü">
            {links.map((item) =>
              item.children ? (
                <TurMenu key={item.label} item={item} path={path} />
              ) : (
                <NavLink key={item.href} item={item} path={path} />
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={telLink()}
              className="hidden items-center gap-3 text-left xl:flex"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-mavi/60 text-mavi">
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-fildisi transition-colors hover:border-kirmizi hover:text-kirmizi lg:hidden"
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
        className={`fixed inset-x-0 bottom-0 z-40 overflow-x-clip bg-camgece transition-all duration-500 ease-yumusak lg:hidden ${
          kaydi ? "top-14" : "top-[7rem]"
        } ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="desen absolute inset-0 opacity-60" aria-hidden />
        <nav className="site-container relative flex h-full flex-col overflow-y-auto py-6" aria-label="Mobil menü">
          {mobilOgeler(links).map((item, i) => {
            const gecikme = { transitionDelay: open ? `${80 + i * 45}ms` : "0ms" };
            if (item.baslik) {
              return (
                <p
                  key={item.label}
                  className={`border-b border-white/[0.07] pb-2 pt-6 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-altinacik transition-all duration-500 ease-yumusak ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={gecikme}
                >
                  {item.label}
                </p>
              );
            }
            const aktif = sayfaAktif(path, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between border-b border-white/[0.07] py-4 font-display transition-all duration-500 ease-yumusak ${
                  item.alt ? "pl-1 text-xl" : "text-2xl"
                } ${aktif ? "text-altinparlak" : "text-fildisi/90"} ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={gecikme}
              >
                {item.label}
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
