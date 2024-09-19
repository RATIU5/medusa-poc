import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: ["dark"],
  theme: {

    fontFamily: {
      display: ["Bebas Neue", ...fontFamily.sans],
    },
    extend: {
      screens: {
        '3xl': '1664px',
        '4xl': '1792px',
        'xs': '400px',
      },
      backgroundImage: {
        "hero-x": "url('/img/raw-steak-horizontal.webp')",
        "hero-y": "url('/img/raw-steak-vertical.webp')",
        "hero-gradient-x-lg": "linear-gradient(90deg,  rgba(12,10,9,1) 0%, rgba(12,10,9,0) 10%, rgba(12,10,9,0) 30%, rgba(12,10,9,0.7567620798319328) 50%, rgba(12,10,9,1) 100%);",
        "hero-gradient-x": "linear-gradient(90deg, rgba(12,10,9,0) 0%, rgba(12,10,9,0) 30%, rgba(12,10,9,0.7567620798319328) 65%, rgba(12,10,9,1) 100%);",
        "hero-gradient-y": "linear-gradient(0deg, rgba(12,10,9,0) 0%, rgba(12,10,9,0) 25%, rgba(12,10,9,0.7567620798319328) 56%, rgba(12,10,9,1) 100%);"
      },
      boxShadow: {
        "hero-inset-dark-l": "inset 100% 0 0 20px rgba(0, 0, 0, 0.5)",
      }
    },
  },
};

export default config;
