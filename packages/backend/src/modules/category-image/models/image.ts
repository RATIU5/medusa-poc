import { model } from "@medusajs/utils";

export const CategoryImage = model.define("category-image", {
  id: model.id().primaryKey(),
  image: model.text().nullable(),
  thumbnail: model.text().nullable(),
});
