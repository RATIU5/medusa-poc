import { createStep, StepResponse } from "@medusajs/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/utils";
import { CATEGORY_IMAGE_MODULE } from "@modules/category-image";
import { LinkCategoryImageInput } from "..";

export const linkCategoryToCategoryImageStep = createStep(
  "link-product-category-to-category-image",
  async ({ categoryId, categoryImageId }: LinkCategoryImageInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    remoteLink.create({
      [Modules.PRODUCT]: {
        productCategory_id: categoryId,
      },
      [CATEGORY_IMAGE_MODULE]: {
        categoryImage_id: categoryImageId,
      },
    });

    return new StepResponse(undefined, {
      categoryId,
      categoryImageId,
    });
  },
  async ({ categoryId, categoryImageId }, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    remoteLink.dismiss({
      [Modules.PRODUCT]: {
        productCategory_id: categoryId,
      },
      [CATEGORY_IMAGE_MODULE]: {
        categoryImage_id: categoryImageId,
      },
    });
  },
);
