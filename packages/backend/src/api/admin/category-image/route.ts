import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { CreateCategoryImageInput, createCategoryImageWorkflow } from "../../../workflows/create-category-image";

export const POST = async (req: MedusaRequest<CreateCategoryImageInput>, res: MedusaResponse) => {
  const { result } = await createCategoryImageWorkflow(req.scope).run({
    input: req.body,
  });

  res.json({ categoryImage: result });
};
