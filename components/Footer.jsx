"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { site, telLink, waLink } from "@/lib/site";
import SocialLinks, { WaIcon } from "@/components/SocialLinks";
import Logo from "@/components/Logo";

const sayfalar = [
  ["/", "Ana Sayfa"],
  ["/hakkimizda", "Hakkımızda"],
  ["/ilkelerimiz", "İlkelerimiz"],
  ["/sss", "Sık Sorulan Sorular"],
  ["/iletisim", "İletişim"],
];

const programlar = [
  ["/umre-turlari", "Umre Turları"],
  ["/hac-turlari", "Hac Programları"],
  ["/kultur-turlari", "Kültür Turları"],
  ["/kisiye-ozel-turlar", "Özel Turlar"],
  ["/paket/ekim-kasim-umresi", "Ekim – Kasım Umresi"],
  ["/paket/aralik-ocak-umresi", "Aralık – Ocak Umresi"],
  ["/paket/tam-ramazan-umresi", "Ramazan Umresi"],
];

function Baslik({ children }) {
  return (
    <p className="text-[0.68rem] font-bold uppercase tracking-kicker text-altinacik">{children}</p>
  );
}

function Baglanti({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 py-1 text-fildisi/70 transition-colors hover:text-altinparlak"
    >
      <span className="h-px w-0 bg-altinacik transition-all duration-300 ease-yumusak group-hover:w-3" aria-hidden />
      {children}
    </Link>
  );
}

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="relative mt-24 overflow-hidden bg-camgece text-fildisi/80">
      <div className="desen pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_at_center,rgba(254,10,0,0.16),transparent_68%)]" aria-hidden />
      <div className="relative h-px bg-gradient-to-r from-transparent via-altinacik/70 to-transparent" aria-hidden />

      {/* Çağrı bandı */}
      <div className="site-container relative">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/[0.08] py-14 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="kicker-acik">Kutsal yolculuğunuz için</p>
            <h2 className="mt-4 text-3xl leading-tight !text-fildisi md:text-[2.4rem]">
              Ziyaretinizi <span className="altin-yazi italic">birlikte</span> planlayalım
            </h2>
            <p className="mt-4 text-fildisi/60">
              Tarih, konaklama ve kayıt şartları için ekibimiz her aşamada yanınızda.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={waLink("Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-altin"
            >
              <WaIcon /> WhatsApp&apos;tan Yazın
            </a>
            <a href={telLink()} className="btn-cam-uzeri">
              <Phone className="h-4 w-4" aria-hidden /> {site.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="site-container relative grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo boyut="buyuk" />
          <p className="mt-6 max-w-sm font-display text-xl leading-snug text-fildisi">{site.slogan}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-fildisi/60">
            Ankara merkezli hac, umre, kültür ve özel turlar. Din görevlisi ve rehber
            eşliğinde programlar; kültür rotalarında tarihe ve doğaya yolculuk.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-altinacik/25 bg-white/[0.03] px-4 py-2 text-xs text-fildisi/70">
            <ShieldCheck className="h-4 w-4 text-altinacik" aria-hidden />
            Dahil ve hariç hizmetler kayıttan önce yazılı bildirilir
          </div>
          <SocialLinks className="mt-6" />
        </div>

        <nav aria-label="Programlar" className="lg:col-span-3">
          <Baslik>Programlar</Baslik>
          <ul className="mt-5 space-y-1.5 text-sm">
            {programlar.map(([href, label]) => (
              <li key={href}><Baglanti href={href}>{label}</Baglanti></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Kurumsal" className="lg:col-span-2">
          <Baslik>Kurumsal</Baslik>
          <ul className="mt-5 space-y-1.5 text-sm">
            {sayfalar.map(([href, label]) => (
              <li key={href}><Baglanti href={href}>{label}</Baglanti></li>
            ))}
          </ul>
        </nav>

        <address className="not-italic sm:col-span-2 lg:col-span-3">
          <Baslik>İletişim</Baslik>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={telLink()} className="flex items-start gap-3 text-fildisi/80 transition-colors hover:text-altinparlak">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-start gap-3 break-all text-fildisi/80 transition-colors hover:text-altinparlak">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3 text-fildisi/70">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
              {site.hours}
            </li>
            <li className="flex items-start gap-3 text-fildisi/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-altinacik" aria-hidden />
              <span>
                {site.address}
                <a
                  href={site.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 flex items-center gap-1.5 text-altinacik transition-colors hover:text-altinparlak"
                >
                  Haritada görüntüle
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
              </span>
            </li>
          </ul>
        </address>
      </div>

      <div className="relative border-t border-white/[0.07]">
        <div className="site-container flex flex-col gap-2 py-6 text-xs leading-relaxed text-fildisi/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Dört Bucak Tur. Tüm hakları saklıdır.</p>
          <p>Vize, pasaport, aşı ve resmî seyahat şartları değişebilir; güncel bilgi için iletişime geçin.</p>
        </div>
      </div>
    </footer>
  );
}
