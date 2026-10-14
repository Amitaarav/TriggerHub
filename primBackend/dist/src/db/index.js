"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const env_config_1 = require("../config/env-config");
const logger_1 = require("../config/logger");
const enableQueryLogging = env_config_1.configEnv.nodeEnv === "development";
const pool = new pg_1.Pool({ connectionString: env_config_1.configEnv.databaseUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const globalForPrisma = globalThis;
const prismaClientOptions = {
    log: enableQueryLogging
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "info" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
        ]
        : ["error"],
};
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient(Object.assign(Object.assign({}, prismaClientOptions), { adapter }));
if (env_config_1.configEnv.nodeEnv !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
// Log queries in development
if (enableQueryLogging) {
    exports.prisma.$on("query", (e) => {
        logger_1.logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
    });
}
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
    yield pool.end();
    process.exit(0);
}));
