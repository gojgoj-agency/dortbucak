import Image from "next/image";
import Link from "next/link";

const olculer = {
  kucuk: "h-[5.75rem] w-[5.75rem]",
  orta: "h-[6rem] w-[8.5rem]",
  buyuk: "h-20 w-24",
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
