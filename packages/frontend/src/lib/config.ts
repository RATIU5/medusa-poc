import Medusa from "@medusajs/medusa-js";
import {
  MEDUSA_BACKEND_URL,
  MEDUSA_PUBLISHABLE_API_KEY,
} from "astro:env/server";

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: MEDUSA_PUBLISHABLE_API_KEY,
});
