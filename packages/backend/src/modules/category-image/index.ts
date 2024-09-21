import { Module } from "@medusajs/utils";
import CategoryImageService from "./service";

export const CATEGORY_IMAGE_MODULE = "categoryImageModuleService";

export default Module(CATEGORY_IMAGE_MODULE, {
  service: CategoryImageService,
});
