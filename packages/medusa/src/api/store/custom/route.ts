import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type HelloModuleService from "../../../modules/hello/service";
import { HELLO_MODULE } from "../../../modules/hello";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const helloModuleService: HelloModuleService =
    req.scope.resolve(HELLO_MODULE);

  res.json({
    message: helloModuleService.getMessage(),
  });
}
