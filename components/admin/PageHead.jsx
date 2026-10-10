import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PageHead({ kicker, title, description, action, back }) {
  return (
    <header className="mb-8">
      {back ? (
        <Link
          href={back.href}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gri transition-colors hover:text-cam"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h1 className="mt-1 text-3xl leading-tight sm:text-[2.35rem]">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gri sm:text-base">{description}</p>
          ) : null}
        </div>
        {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
      </div>
    </header>
  );
}

export function Flash({ children }) {
  if (!children) return null;
  return (
    <p
      role="status"
      className="mb-6 flex items-center gap-2.5 rounded-xl border border-cam/10 bg-kagit px-4 py-3 text-sm font-medium text-cam shadow-kart"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-altin" aria-hidden />
      {children}
    </p>
  );
}

export function Bos({ title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-cizgi bg-kagit/80 px-6 py-14 text-center">
      <p className="font-display text-xl text-cam">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gri">{text}</p>
    </div>
  );
}
