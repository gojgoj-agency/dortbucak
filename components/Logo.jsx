import Image from "next/image";
import Link from "next/link";

export default function Logo({ tone = "dark", className = "" }) {
  const acikZemin = tone === "light";

  return (
    <Link
      href="/"
      aria-label="Dört Bucak Tur ana sayfa"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <span
        className={`relative block overflow-hidden ${
          acikZemin
            ? "h-12 w-40 rounded-xl bg-white shadow-sm sm:h-14 sm:w-48"
            : "h-11 w-[9.5rem] lg:h-12 lg:w-44 xl:h-14 xl:w-48"
        }`}
      >
        <Image
          src="/images/logo.webp"
          alt=""
          fill
          priority={!acikZemin}
          sizes="192px"
          className="origin-center scale-[3.35] object-contain"
          style={acikZemin ? undefined : { mixBlendMode: "multiply" }}
        />
      </span>
    </Link>
  );
}
