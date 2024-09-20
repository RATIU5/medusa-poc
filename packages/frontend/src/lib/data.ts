import { medusaClient } from "@lib/config";
import type { ProductCategoryWithChildren } from "types/global";

export const getCategoriesList = async function (
  offset: number = 0,
  limit: number = 100,
): Promise<{
  product_categories: ProductCategoryWithChildren[];
  count: number;
}> {
  const { product_categories, count } = await medusaClient.productCategories
    .list({ limit, offset }, { next: { tags: ["categories"] } })
    .catch((err: unknown) => {
      throw err;
    });

  return {
    product_categories,
    count,
  };
};
