import { createLogger, format, transports } from "winston";
import { configEnv } from "./env-config";

const { combine, timestamp, printf, colorize, errors, json } = format;

/**
 * Custom format for development – clear, colorized, and human-readable.
 * Includes Correlation/Request ID if present.
 */
const developmentFormat = printf(({ level, message, timestamp, stack, requestId, ...meta }) => {
    const rid = requestId ? ` [${requestId}]` : "";
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
    return `${timestamp}${rid} ${level}: ${message}${stack ? `\n${stack}` : ""}${metaStr}`;
});

/**
 * Enhanced Winston logger with environment-aware formatting and millisecond precision.
 */
export const logger = createLogger({
    level: configEnv.nodeEnv === "production" ? "info" : "debug",

    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        errors({ stack: true }),
        configEnv.nodeEnv === "production" ? json() : combine(colorize(), developmentFormat)
    ),

    transports: [
        new transports.Console(),
        new transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new transports.File({
            filename: "logs/combined.log",
            maxsize: 10485760, // 10MB
            maxFiles: 5,
        })
    ],

    // Prevent exit on handled exceptions
    exitOnError: false,
});