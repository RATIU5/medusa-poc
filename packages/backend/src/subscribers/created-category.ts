import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { linkCategoryImageWorkflow } from "@workflows/create-category-image";

async function createdCategoryHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  await linkCategoryImageWorkflow(container).run({
    input: {
      categoryId: data.id,
      categoryImageId: data.categoryImageId,
    },
  });
}

export default createdCategoryHandler;

export const config: SubscriberConfig = {
  event: "product-category.created",
};
