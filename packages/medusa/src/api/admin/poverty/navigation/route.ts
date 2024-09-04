import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import * as jwt from "jsonwebtoken";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.requestId;
  const token = generateToken(userId);

  const result = await fetch(`${process.env.VITE_POVERTY_URL}/api/v1/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req.body)
  });
  if (!result.ok) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: null
    })
  }
  if (result.status !== 201) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: null
    })
  }
  const data = await result.json();

  return res.status(200).json({data});
};

function generateToken(userId: string) {
  const payload = {
    userId,
  };
  const options = {
    expiresIn: "96h",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
