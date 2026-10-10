import Link from "next/link";

export const metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="site-container py-20 md:py-28">
      <div className="mx-auto max-w-xl rounded-[1.75rem] border border-cizgi bg-kagit px-8 py-14 text-center shadow-kart">
        <p className="kicker">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Sayfa bulunamadı</h1>
        <div className="baslik-cizgi" />
        <p className="mt-5 text-gri">Aradığınız sayfa kaldırılmış veya adresi değişmiş olabilir.</p>
        <Link href="/" className="btn-cam mt-8">Ana sayfaya dön</Link>
      </div>
    </div>
  );
}
