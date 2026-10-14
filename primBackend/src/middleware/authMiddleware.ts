
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { configEnv } from "../config/env-config";

export interface AuthenticatedRequest extends Request {
  id?: string | number;
}

export interface JWTPayload extends JwtPayload {
  id: string | number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  console.log("[Auth Middleware]", {
    method: req.method,
    path: req.originalUrl,
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    usesBearerScheme: req.headers.authorization?.startsWith("Bearer "),
  });
  
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      message: "Authentication token is missing",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      configEnv.jwtSecret
    );

    if (
      typeof payload === "string" ||
      (typeof payload.id !== "string" &&
        typeof payload.id !== "number")
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    (req as AuthenticatedRequest).id = payload.id;

    next();
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      res.status(401).json({
        message: "Invalid or expired authentication token",
      });
      return;
    }

    console.error("[Auth] Unexpected JWT verification error");

    res.status(500).json({
      message: "Authentication service error",
    });
  }
}
