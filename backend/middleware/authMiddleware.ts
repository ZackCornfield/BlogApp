import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, check credentials" });
  }

  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({ message: "Server error: JWT_SECRET is not defined" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid token, please login again" });
    }

    (req as any).user = user; // Type assertion to avoid TypeScript errors
    next();
  });
}
