import globals from "globals";
import astroPlugin from "eslint-plugin-astro";
import sveltePlugin from "eslint-plugin-svelte";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("../../eslint.config.js"),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,astro,svelte}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  ...astroPlugin.configs.recommended,
  {
    files: ["**/*.astro"],
    parser: "astro-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser",
      extraFileExtensions: [".astro"],
    },
    rules: {},
  },
  {
    files: ["**/*.svelte"],
    plugins: {
      svelte: sveltePlugin,
    },
    parser: "svelte-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser",
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
    },
  },
];
