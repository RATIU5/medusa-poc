/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  arrowParens: "always",
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
};
