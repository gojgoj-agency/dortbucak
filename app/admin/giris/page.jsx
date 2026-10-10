"use client";
import { useFormState } from "react-dom";
import { loginAction } from "../actions";

export default function Login() {
  const [state, action] = useFormState(loginAction, {});

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-camgece lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="doku absolute inset-0" aria-hidden />
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 grid-cols-2 gap-0.5" aria-hidden>
            <span className="bg-altin" />
            <span className="bg-fildisi" />
            <span className="bg-fildisi/75" />
            <span className="bg-altin" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl text-fildisi">Dört Bucak</span>
            <span className="mt-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.28em] text-altinacik">
              Tur
            </span>
          </span>
        </div>
        <div className="relative max-w-md">
          <p className="kicker-acik">Yönetim paneli</p>
          <p className="mt-3 font-display text-4xl leading-[1.15] text-fildisi">
            Programları, fiyatları ve vitrini tek yerden güncelleyin.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fildisi/70">
            Hac ve umre paketleri ile ana sayfa slider’ı buradan yayına alınır.
          </p>
        </div>
        <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-altinacik">
          Ankara · Keçiören
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-9 w-9 grid-cols-2 gap-0.5" aria-hidden>
              <span className="bg-cam" />
              <span className="bg-altin" />
              <span className="bg-altin" />
              <span className="bg-camacik" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl text-cam">Dört Bucak</span>
              <span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.28em] text-altin">
                Yönetim
              </span>
            </span>
          </div>

          <form action={action} className="rounded-2xl border border-cizgi bg-kagit p-6 shadow-kart sm:p-8">
            <p className="kicker">Giriş</p>
            <h1 className="mt-2 text-3xl">Hoş geldiniz</h1>
            <p className="mt-2 text-sm text-gri">Devam etmek için yönetici bilgilerinizi girin.</p>

            <div className="mt-7 space-y-4">
              <div>
                <label htmlFor="username" className="yonetim-etiket">
                  Kullanıcı adı
                </label>
                <input
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
                  className="yonetim-alan"
                />
              </div>
              <div>
                <label htmlFor="password" className="yonetim-etiket">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="yonetim-alan"
                />
              </div>
              <div className="hidden" aria-hidden="true">
                <input name="web_adresi" tabIndex={-1} autoComplete="off" />
              </div>
              {state?.error ? (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {state.error}
                </p>
              ) : null}
              <button className="btn-cam w-full">Giriş yap</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
