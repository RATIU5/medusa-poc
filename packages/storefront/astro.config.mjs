import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  experimental: {
    env: {
      schema: {
        MEDUSA_PUBLISHABLE_API_KEY: envField.string({
          context: "server",
          access: "secret",
        }),
        MEDUSA_BACKEND_URL: envField.string({
          context: "server",
          access: "secret",
        }),
      },
    },
  },
});
