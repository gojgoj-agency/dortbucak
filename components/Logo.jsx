import Image from "next/image";
import Link from "next/link";

const olculer = {
  kucuk: "h-[4.5rem] w-[6.0rem]",
  orta: "h-[4.5rem] w-[6.5rem]",
  buyuk: "h-[6rem] w-[8.5rem]",
};

export default function Logo({ className = "", boyut = "orta" }) {
  return (
    <Link
      href="/"
      aria-label="Dört Bucak Tur ana sayfa"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src="/images/logo.webp"
        alt="Dört Bucak Tur"
        width={1600}
        height={1600}
        priority={boyut !== "buyuk"}
        sizes="240px"
        className={`${olculer[boyut] || olculer.orta} rounded-xl bg-white object-contain`}
      />
    </Link>
  );
}
