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
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).json({ message: "No or malformed authorization header" });
        return;
    }
    console.log("authHeader: ", authHeader);
    const token = authHeader.split(" ")[1];
    console.log("Token: ", token);
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        console.log("payload: ", payload);
        req.id = payload.id;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        res.status(403).json({ message: "Sorry! You are not logged in" });
    }
}
