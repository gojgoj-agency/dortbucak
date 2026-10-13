"use client";

import { usePathname } from "next/navigation";
import { WaIcon } from "@/components/SocialLinks";
import { waLink } from "@/lib/site";

const mesaj = "Merhaba, hac ve umre programlarınız hakkında bilgi almak istiyorum.";

export default function WaFloat() {
  const path = usePathname() || "";
  if (path.startsWith("/admin")) return null;

  // Paket detayında mobilde altta sabit bir bilgi çubuğu var; buton onun üstünde dursun.
  const paketDetay = path.startsWith("/paket/");

  return (
    <a
      href={waLink(mesaj)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      title="WhatsApp ile yazın"
      className={`fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1D7550] text-white shadow-kartust transition-all duration-300 ease-yumusak hover:-translate-y-0.5 hover:bg-[#165E40] print:hidden sm:right-6 sm:h-[3.75rem] sm:w-[3.75rem] ${
        paketDetay
          ? "bottom-24 lg:bottom-6"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6"
      }`}
    >
      <WaIcon className="h-7 w-7 sm:h-8 sm:w-8" />
    </a>
  );
}
