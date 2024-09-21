import { defineMiddlewares } from "@medusajs/medusa";
import { z } from "zod";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/product-categories",
      method: ["POST"],
      additionalDataValidator: {
        categoryImage_id: z.string().optional(),
      },
    },
  ],
});
