import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk";
import { createCategoryImageStep } from "./steps/create-category-image";
import { linkCategoryToCategoryImageStep } from "./steps/link-category-image";

export type CreateCategoryImageInput = {
  image?: string;
  thumbnail?: string;
};

export type LinkCategoryImageInput = {
  categoryId: string;
  categoryImageId: string;
};

export const createCategoryImageWorkflow = createWorkflow(
  "create-category-image",
  (input: CreateCategoryImageInput) => {
    const categoryImage = createCategoryImageStep(input);
    return new WorkflowResponse(categoryImage);
  },
);

export const linkCategoryImageWorkflow = createWorkflow("link-category-image", (input: LinkCategoryImageInput) => {
  const categoryImage = linkCategoryToCategoryImageStep(input);
  return new WorkflowResponse(categoryImage);
});
