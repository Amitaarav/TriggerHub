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

  console.log("authHeader: ",authHeader);

  const token = authHeader.split(" ")[1];

  console.log("Token: " , token);

  try {
    const payload = jwt.verify(token, JWT_PASSWORD) as JWTPayload;
    console.log("payload: ", payload);
    (req as CustomRequest).id = payload.id;

    next();
    
  } catch (err) {

    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Sorry! You are not logged in" });
  }
}
