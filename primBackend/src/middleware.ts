import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from "./config";

interface JWTPayload {
    id: string | number;
}

export interface CustomRequest extends Request {
    id: string | number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);
    
    if (!authHeader) {
        console.log("No authorization header found");
        res.status(403).json({
            message: "Authorization header is missing"
        });
        return;
    }

    const [bearer, token] = authHeader.split(' ');
    console.log("Bearer:", bearer);
    console.log("Token:", token);
    
    if (bearer !== 'Bearer' || !token) {
        console.log("Invalid authorization format");
        res.status(403).json({
            message: "Invalid authorization header format"
        });
        return;
    }

    try {
        console.log("Verifying token with secret:", JWT_PASSWORD);
        const payload = jwt.verify(token, JWT_PASSWORD) as JWTPayload;
        console.log("Token payload:", payload);
        
        if (!payload.id) {
            console.log("No id in token payload");
            res.status(403).json({
                message: "Invalid token payload"
            });
            return;
        }
        (req as CustomRequest).id = payload.id;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(403).json({
            message: "Invalid or expired token",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}