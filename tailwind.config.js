/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cam: "#0F1B33",      // gece laciverti (ana)
        camderin: "#0B1428", // daha koyu lacivert
        camgece: "#070D1B",  // en koyu — hero ve footer zemini
        camacik: "#2B3C5F",  // açık lacivert
        fildisi: "#F7F3EC",  // fildişi zemin
        kagit: "#FFFDF9",    // kart zemini
        mavi: "#007BB6",
        kirmizi: "#FE0A00",
        altin: "#FE0A00",
        altinacik: "#FF5C56",
        altinparlak: "#FE0A00",
        murekkep: "#141B2B",
        gri: "#5D6575",
        cizgi: "#E7DFD1",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "76rem", genis: "86rem" },
      letterSpacing: { kicker: "0.3em" },
      boxShadow: {
        kart: "0 1px 2px rgba(11,20,40,.05), 0 10px 30px -14px rgba(11,20,40,.18)",
        kartust: "0 2px 6px rgba(11,20,40,.06), 0 34px 60px -28px rgba(11,20,40,.38)",
        derin: "0 50px 100px -45px rgba(7,13,27,.75)",
        altinhale: "0 0 0 1px rgba(254,10,0,.35), 0 18px 40px -18px rgba(254,10,0,.45)",
        lux: "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.6)",
      },
      backgroundImage: {
        "perde-alt":
          "linear-gradient(to top, rgba(7,13,27,.95) 0%, rgba(7,13,27,.7) 30%, rgba(7,13,27,.45) 55%, rgba(7,13,27,.35) 75%, rgba(7,13,27,.65) 100%)",
        vinyet: "radial-gradient(120% 85% at 50% 45%, transparent 38%, rgba(7,13,27,.6) 100%)",
        "perde-kart": "linear-gradient(to top, rgba(7,13,27,.85) 0%, rgba(7,13,27,.25) 50%, rgba(7,13,27,.05) 100%)",
        "altin-cizgi": "linear-gradient(90deg, transparent, #FE0A00 20%, #FF5C56 50%, #FE0A00 80%, transparent)",
        "altin-gradyan": "linear-gradient(135deg, #FF4D47 0%, #FE0A00 55%, #C90800 100%)",
        "hero-yan": "linear-gradient(90deg, rgba(7,13,27,.92) 0%, rgba(7,13,27,.72) 38%, rgba(7,13,27,.25) 70%, rgba(7,13,27,.1) 100%)",
      },
      keyframes: {
        kenburns: {
          "0%":   { transform: "scale(1.04) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.14) translate3d(-1%,-1%,0)" },
        },
        belir: {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ilerle: {
          "0%":   { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
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
        kenburns: "kenburns 14s ease-out forwards",
        belir: "belir .9s cubic-bezier(.22,.8,.3,1) both",
        ilerle: "ilerle 7s linear forwards",
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
