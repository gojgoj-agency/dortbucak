import Image from "next/image";
import Link from "next/link";

// logo.png kare ve şeffaf; işaret yatay bir şerit. Kutuyu bu şeride göre kırpıyoruz.
const olculer = {
  kucuk: "h-8 w-[6.7rem]",
  orta: "h-10 w-[8.4rem]",
  buyuk: "h-14 w-[11.75rem]",
};

export default function Logo({ className = "", boyut = "orta" }) {
  return (
    <Link
      href="/"
      aria-label="Dört Bucak Tur ana sayfa"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <span className={`relative block overflow-hidden ${olculer[boyut] || olculer.orta}`}>
        <Image
          src="/images/logo.png"
          alt=""
          width={500}
          height={500}
          priority={boyut !== "buyuk"}
          sizes="200px"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[415%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </span>
    </Link>
  );
}
