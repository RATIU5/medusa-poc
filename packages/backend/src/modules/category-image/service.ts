import { MedusaService } from "@medusajs/utils";
import { CategoryImage } from "./models/image";

class CategoryImageModuleService extends MedusaService({
  CategoryImage,
}) {}

export default CategoryImageModuleService;
