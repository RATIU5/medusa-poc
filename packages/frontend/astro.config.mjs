// @ts-check
import { defineConfig, envField } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      MEDUSA_BACKEND_URL: envField.string({
        context: "server",
        access: "public",
      }),
      MEDUSA_PUBLISHABLE_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  output: "static",
  integrations: [
    svelte(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
