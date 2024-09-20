import type { ProductCategoryDTO } from "@medusajs/types";

export type ProductCategoryWithChildren = Omit<
  ProductCategoryDTO,
  "category_children"
> & {
  category_children: ProductCategoryDTO[];
  category_parent?: ProductCategoryDTO;
};
