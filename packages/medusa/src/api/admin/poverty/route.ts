import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import * as jwt from "jsonwebtoken";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.requestId;
  const token = generateToken(userId);
  // console.log(token);

  const result = await fetch(
    `${process.env.REACT_PUBLIC_POVERTY_URL}/api/v1/hello`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await result.json();

  res.json(data);
};

function generateToken(userId: string) {
  const payload = {
    userId,
  };
  const options = {
    expiresIn: "24h",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
