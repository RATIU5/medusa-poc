import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk";
import { createCategoryImageStep } from "./steps/create-category-image";

export type CreateCategoryImageInput = {
  image?: string;
  thumbnail?: string;
};

export const createCategoryImageWorkflow = createWorkflow(
  "create-category-image",
  (input: CreateCategoryImageInput) => {
    const categoryImage = createCategoryImageStep(input);
    return new WorkflowResponse(categoryImage);
  },
);
