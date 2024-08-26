import Medusa from "@medusajs/medusa-js";
import {
  MEDUSA_BACKEND_URL,
  MEDUSA_PUBLISHABLE_API_KEY,
} from "astro:env/server";

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 1,
  publishableApiKey: MEDUSA_PUBLISHABLE_API_KEY,
});
