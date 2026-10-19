"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CircleHelp, Compass, Images, LogOut, Package, ScrollText } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin/paketler", label: "Paketler", hint: "Programlar ve fiyatlar", icon: Package },
  { href: "/admin/slider", label: "Slider", hint: "Ana sayfa vitrini", icon: Images },
  { href: "/admin/sss", label: "SSS", hint: "Sık sorulan sorular", icon: CircleHelp },
  { href: "/admin/ilkelerimiz", label: "İlkelerimiz", hint: "Sayfa maddeleri", icon: ScrollText },
  { href: "/admin/kisiye-ozel", label: "Özel Turlar", hint: "Metin, görsel ve kartlar", icon: Compass },
];

function Mark({ light = false }) {
  return (
    <span className="grid h-8 w-8 shrink-0 grid-cols-2 gap-0.5" aria-hidden>
      <span className={light ? "bg-altin" : "bg-cam"} />
      <span className={light ? "bg-fildisi" : "bg-altin"} />
      <span className={light ? "bg-fildisi/75" : "bg-altin"} />
      <span className={light ? "bg-altin" : "bg-camacik"} />
    </span>
  );
}

function aktifMi(path, href) {
  return path === href || path.startsWith(`${href}/`);
}

export default function AdminBar({ username = "Yönetici" }) {
  const path = usePathname();
  const harf = String(username).slice(0, 1).toUpperCase();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-camgece text-fildisi lg:flex">
        <div className="h-1 bg-altin" aria-hidden />
        <div className="px-5 pb-7 pt-6">
          <Link href="/admin/paketler" className="flex items-center gap-3">
            <Mark light />
            <span className="leading-none">
              <span className="block font-display text-lg tracking-tight">Dört Bucak</span>
              <span className="mt-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.28em] text-altinacik">
                Yönetim
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3" aria-label="Yönetim menüsü">
          {links.map(({ href, label, hint, icon: Icon }) => {
            const aktif = aktifMi(path, href);
            return (
              <a
                key={href}
                href={href}
                aria-current={aktif ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  aktif ? "bg-white/10 text-fildisi" : "text-fildisi/70 hover:bg-white/5 hover:text-fildisi"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    aktif ? "bg-altin text-white" : "bg-white/5 text-altinacik"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className={`block text-xs ${aktif ? "text-fildisi/60" : "text-fildisi/40"}`}>{hint}</span>
                </span>
              </a>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-fildisi/70 transition-colors hover:bg-white/5 hover:text-fildisi"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            Siteyi görüntüle
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-altin text-sm font-bold text-white">
              {harf}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{username}</span>
              <span className="block text-xs text-fildisi/45">Yönetici</span>
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg p-2 text-fildisi/60 transition-colors hover:bg-white/10 hover:text-fildisi"
                aria-label="Çıkış yap"
                title="Çıkış yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-cizgi bg-kagit/95 backdrop-blur-md lg:hidden">
        <div className="h-1 bg-altin" aria-hidden />
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin/paketler" className="flex min-w-0 items-center gap-2.5">
            <Mark />
            <span className="min-w-0 leading-none">
              <span className="block truncate font-display text-lg text-cam">Dört Bucak</span>
              <span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-altin">
                Yönetim
              </span>
            </span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-cizgi px-3 py-1.5 text-sm font-semibold text-gri transition-colors hover:border-cam hover:text-cam"
            >
              Çıkış
            </button>
          </form>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3" aria-label="Yönetim menüsü">
          {links.map(({ href, label, icon: Icon }) => {
            const aktif = aktifMi(path, href);
            return (
              <a
                key={href}
                href={href}
                aria-current={aktif ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  aktif ? "bg-cam text-fildisi" : "bg-fildisi text-gri hover:text-cam"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </a>
            );
          })}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fildisi px-3.5 py-1.5 text-sm font-semibold text-gri"
          >
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            Site
          </Link>
        </nav>
      </header>
    </>
  );
}
