import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { configEnv } from "../config/env-config";
import { logger } from "../config/logger";

const enableQueryLogging = configEnv.nodeEnv === "development";
const pool = new Pool({ connectionString: configEnv.databaseUrl });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient<Prisma.PrismaClientOptions, "query"> | undefined;
};

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: enableQueryLogging
    ? [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" },
      ]
    : ["error"],
};

export const prisma =
  globalForPrisma.prisma ??
  (new PrismaClient({ ...prismaClientOptions, adapter }) as PrismaClient<Prisma.PrismaClientOptions, "query">);

if (configEnv.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

// Log queries in development
if (enableQueryLogging) {
  prisma.$on("query", (e) => {
    logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
  });
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});
