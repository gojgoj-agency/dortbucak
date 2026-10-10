"use client";
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";

/**
 * Kaydırdıkça beliren sarmalayıcı.
 *
 * Neden framer-motion değil: animasyon kütüphaneleri ögeyi sunucuda opacity:0
 * ile basar; JS yüklenmezse ya da geç yüklenirse sayfa bomboş görünür. Burada
 * gizleme işini CSS yapar ve yalnızca <html class="js"> varken devreye girer —
 * yani JS yoksa içerik olduğu gibi görünür kalır.
 *
 * gecikme — saniye cinsinden bekleme (sıralı belirme için)
 * yon     — "alt" | "sol" | "sag" | "yok"
 */
export default function Reveal({
  children,
  gecikme = 0,
  yon = "alt",
  className = "",
  as: Etiket = "div",
}) {
  const ref = useRef(null);
  const [belirdi, setBelirdi] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Destek yoksa doğrudan göster
    if (typeof IntersectionObserver === "undefined") {
      setBelirdi(true);
      return;
    }
    const gozlemci = new IntersectionObserver(
      ([giris]) => {
        if (giris.isIntersecting) {
          setBelirdi(true);
          gozlemci.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    gozlemci.observe(el);
    return () => gozlemci.disconnect();
  }, []);

  return (
    <Etiket
      ref={ref}
      className={`belir-bekle belir-${yon}${belirdi ? " belirdi" : ""}${className ? " " + className : ""}`}
      style={gecikme ? { transitionDelay: `${gecikme}s` } : undefined}
    >
      {children}
    </Etiket>
  );
}

/**
 * Çocuklarını sırayla belirtir. Her çocuğa artan bir gecikme geçirir;
 * çocuklar <RevealOge> olmalıdır.
 */
export function RevealGrup({ children, className = "", aralik = 0.1, as = "div" }) {
  return (
    <RevealGrupKap as={as} className={className}>
      {Children.map(children, (cocuk, i) =>
        isValidElement(cocuk) ? cloneElement(cocuk, { gecikme: i * aralik }) : cocuk
      )}
    </RevealGrupKap>
  );
}

function RevealGrupKap({ children, className, as: Etiket = "div" }) {
  return <Etiket className={className}>{children}</Etiket>;
}

/** RevealGrup içindeki tek bir öge. */
export function RevealOge({ children, gecikme = 0, yon = "alt", className = "", as = "div" }) {
  return (
    <Reveal gecikme={gecikme} yon={yon} className={className} as={as}>
      {children}
    </Reveal>
  );
}
