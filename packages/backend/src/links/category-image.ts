import CategoryImageModule from "../modules/category-image";
import ProductModule from "@medusajs/product";
import { defineLink } from "@medusajs/utils";

export default defineLink(
  {
    linkable: ProductModule.linkable.productCategory,
    isList: false,
  },
  {
    linkable: CategoryImageModule.linkable.categoryImage,
    deleteCascade: true,
  },
);
