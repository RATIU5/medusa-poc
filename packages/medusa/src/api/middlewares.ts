import { defineMiddlewares } from "@medusajs/medusa";

import { raw } from "body-parser";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/poverty/media",
      bodyParser: false,
      middlewares: [
        raw({
          type: "multipart/form-data",
          limit: "10mb",
        }),
      ],
    },
  ],
});
