import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config/config";

interface JWTPayload {
  id: string | number;
}

export interface CustomRequest extends Request {
  id: string | number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  const authHeader = req.headers.authorization as unknown as string;

  console.log("authHeader", authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {

    res.status(403).json({ message: "No or malformed authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_PASSWORD) as JWTPayload;
    (req as CustomRequest).id = payload.id;

    next();

  } catch (err: any) {

    console.error("JWT verification failed:", err);

    // Provide more specific error messages for different JWT errors
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: "Token expired. Please login again." });
    } else if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ message: "Invalid token. Please login again." });
    } else {
      res.status(403).json({ message: "Authentication failed. Please login again." });
    }
  }
}
