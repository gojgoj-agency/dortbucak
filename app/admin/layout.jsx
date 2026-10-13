import { cookies } from "next/headers";
import { verifySessionValue, SESSION_COOKIE } from "@/lib/auth";
import AdminBar from "@/components/admin/AdminBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata = { title: "Yönetim Paneli", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  const session = await verifySessionValue(cookies().get(SESSION_COOKIE)?.value);

  if (!session) {
    return <div className="min-h-screen bg-fildisi">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-fildisi bg-[radial-gradient(ellipse_at_top,rgba(196,98,45,0.07),transparent_42%)]">
      <AdminBar username={session.u} />
      <div className="lg:pl-64">
        <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
