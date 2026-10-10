"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { site, telLink, waLink } from "@/lib/site";
import SocialLinks, { WaIcon } from "@/components/SocialLinks";
import Logo from "@/components/Logo";

const sayfalar = [
  ["/", "Ana Sayfa"],
  ["/hac-turlari", "Hac Turları"],
  ["/umre-turlari", "Umre Turları"],
  ["/hakkimizda", "Hakkımızda"],
  ["/sss", "Sık Sorulan Sorular"],
  ["/iletisim", "İletişim"],
];

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="mt-20 bg-camderin text-fildisi/85">
      <div className="h-px bg-gradient-to-r from-transparent via-altinacik/80 to-transparent" aria-hidden />
      <div className="site-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-14">
        <div className="sm:col-span-2 lg:col-span-5">
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fildisi/70">
            Ankara Keçiören merkezli hac ve umre programları. Tarih, konaklama ve
            kayıt için telefon, e-posta veya WhatsApp üzerinden bize ulaşabilirsiniz.
          </p>
          <SocialLinks className="mt-5" />
        </div>

        <nav aria-label="Alt menü" className="lg:col-span-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-altinacik">Sayfalar</p>
          <ul className="mt-4 space-y-2 text-sm">
            {sayfalar.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-0.5 text-fildisi/80 transition-colors hover:text-altinacik">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic lg:col-span-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-altinacik">İletişim</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={telLink()} className="inline-flex items-start gap-2.5 text-fildisi/85 transition-colors hover:text-altinacik">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
                <span><span className="block text-[0.68rem] uppercase tracking-[0.14em] text-fildisi/45">Telefon</span>{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={waLink("Merhaba")} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2.5 text-fildisi/85 transition-colors hover:text-altinacik">
                <WaIcon className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" />
                <span><span className="block text-[0.68rem] uppercase tracking-[0.14em] text-fildisi/45">WhatsApp</span>WhatsApp ile yazın</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-start gap-2.5 break-all text-fildisi/85 transition-colors hover:text-altinacik">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
                <span><span className="block text-[0.68rem] uppercase tracking-[0.14em] text-fildisi/45">E-posta</span>{site.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-fildisi/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
              <span>
                {site.address}
                <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="mt-1 block text-altinacik underline decoration-altin/40 underline-offset-4 hover:decoration-altinacik">
                  Haritada görüntüle
                </a>
              </span>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-fildisi/10">
        <div className="site-container flex flex-col gap-2 py-5 text-xs leading-relaxed text-fildisi/55 sm:text-sm">
          <p>© {new Date().getFullYear()} Dört Bucak Tur. Tüm hakları saklıdır.</p>
          <p className="md:whitespace-nowrap">Vize, pasaport, aşı ve resmî seyahat şartları değişebilir; güncel bilgi için iletişime geçin.</p>
        </div>
      </div>
    </footer>
  );
}
