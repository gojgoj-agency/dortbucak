/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cam: "#1B2A4A",      // lacivert (ana)
        camderin: "#121C33", // daha koyu lacivert
        camgece: "#0C1222",  // en koyu — hero zemini
        camacik: "#3D5278",  // açık lacivert
        fildisi: "#F7F2EA",  // sıcak kum zemin
        kagit: "#FBF8F3",    // kart zemini
        altin: "#C4622D",    // bakır
        altinacik: "#E4B898",
        altinparlak: "#F3D7C4",
        murekkep: "#1C2433",
        gri: "#5C6573",
        cizgi: "#E4D9CC",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "72rem", genis: "84rem" },
      letterSpacing: { kicker: "0.28em" },
      boxShadow: {
        kart: "0 1px 2px rgba(18,28,51,.06), 0 8px 24px -12px rgba(18,28,51,.18)",
        kartust: "0 2px 6px rgba(18,28,51,.08), 0 28px 50px -24px rgba(18,28,51,.32)",
        derin: "0 40px 80px -40px rgba(12,18,34,.7)",
        altinhale: "0 0 0 1px rgba(196,98,45,.35), 0 12px 32px -14px rgba(196,98,45,.4)",
      },
      backgroundImage: {
        "perde-alt":
          "linear-gradient(to top, rgba(12,18,34,.94) 0%, rgba(12,18,34,.72) 28%, rgba(12,18,34,.5) 52%, rgba(12,18,34,.42) 74%, rgba(12,18,34,.7) 100%)",
        vinyet: "radial-gradient(120% 85% at 50% 45%, transparent 38%, rgba(12,18,34,.55) 100%)",
        "perde-kart": "linear-gradient(to top, rgba(12,18,34,.78) 0%, rgba(12,18,34,.16) 55%, transparent 100%)",
        "altin-cizgi": "linear-gradient(90deg, transparent, #C4622D 22%, #F3D7C4 50%, #C4622D 78%, transparent)",
      },
      keyframes: {
        kenburns: {
          "0%":   { transform: "scale(1.06) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.18) translate3d(0,-1.2%,0)" },
        },
        belir: {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        parilti: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sekmele: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(7px)" },
        },
      },
      animation: {
        kenburns: "kenburns 16s ease-out forwards",
        belir: "belir .7s cubic-bezier(.22,.8,.3,1) both",
        parilti: "parilti 2.6s linear infinite",
        sekmele: "sekmele 2.2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        yumusak: "cubic-bezier(.22,.8,.3,1)",
      },
    },
  },
  plugins: [],
};
