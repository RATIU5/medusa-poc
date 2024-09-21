import { createProductCategoriesWorkflow } from "@medusajs/core-flows";
import { StepResponse } from "@medusajs/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/utils";
import { CATEGORY_IMAGE_MODULE } from "../../modules/category-image";
import CategoryImageModuleService from "../../modules/category-image/service";

createProductCategoriesWorkflow.hooks.productCategoryCreated(
  async ({ products, additional_data }, { container }) => {
    if (!additional_data.brand_id) {
      return new StepResponse([], []);
    }

    const categoryImageModuleService: CategoryImageModuleService = container.resolve(CATEGORY_IMAGE_MODULE);
    await categoryImageModuleService.retrieveCategoryImage(additional_data.brand_id as string);

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    const links = [];
    const uniqueCategories = new Set();

    for (const product of products) {
      for (const category of product.categories) {
        if (uniqueCategories.has(category.id)) {
          continue;
        }
        uniqueCategories.add(category.id);
      }
    }

    for (const categoryId of uniqueCategories) {
      links.push({
        [Modules.PRODUCT]: {
          productCategory_id: categoryId,
        },
        [CATEGORY_IMAGE_MODULE]: {
          categoryImage_id: additional_data.brand_id,
        },
      });
    }

    await remoteLink.create(links);

    return new StepResponse(links, links);
  },
  async ({ links }, { container }) => {
    if (!links.length) {
      return;
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    await remoteLink.dismiss(links);
  },
);
