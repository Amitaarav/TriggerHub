"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function authMiddleware(req, res, next) {
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
        console.log("Verifying token with secret:", config_1.JWT_PASSWORD);
        const payload = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        console.log("Token payload:", payload);
        if (!payload.id) {
            console.log("No id in token payload");
            res.status(403).json({
                message: "Invalid token payload"
            });
            return;
        }
        req.id = payload.id;
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        res.status(403).json({
            message: "Invalid or expired token",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
