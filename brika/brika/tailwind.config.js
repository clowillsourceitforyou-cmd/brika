/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17140F",
        paper: "#F6F3EE",
        sand: "#ECE6DA",
        line: "#E2DACB",
        azur: "#1E55A0",
        "azur-dark": "#163E78",
        muted: "#6B6357",
      },
      fontFamily: {
        display: ['"Archivo Expanded"', '"Archivo"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.18em",
      },
      maxWidth: {
        site: "1320px",
      },
      keyframes: {
        slidein: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideleft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        slidein: "slidein .32s cubic-bezier(.22,1,.36,1)",
        slideleft: "slideleft .34s cubic-bezier(.22,1,.36,1)",
        fade: "fade .3s ease",
        rise: "rise .6s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};
