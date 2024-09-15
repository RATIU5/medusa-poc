import * as jwt from "jsonwebtoken";

export function generateToken(userId: string) {
  const payload = {
    userId,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
