import { createStep, StepResponse } from "@medusajs/workflows-sdk";
import { CreateCategoryImageInput } from "..";
import { CATEGORY_IMAGE_MODULE } from "@modules/category-image";
import CategoryImageModuleService from "@modules/category-image/service";

export const createCategoryImageStep = createStep(
  "create-catgory-image-step",
  async (input: CreateCategoryImageInput, { container }) => {
    const categoryImageModuleService: CategoryImageModuleService = container.resolve(CATEGORY_IMAGE_MODULE);

    const categoryImage = await categoryImageModuleService.createCategoryImages(input);

    return new StepResponse(categoryImage, categoryImage.id);
  },
  async (id: string, { container }) => {
    const categoryImageModuleService: CategoryImageModuleService = container.resolve(CATEGORY_IMAGE_MODULE);
    await categoryImageModuleService.deleteCategoryImages(id);
  },
);
