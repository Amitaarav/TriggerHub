import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient<Prisma.PrismaClientOptions, "query"> | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "info" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ]
        : ["warn", "error"],
  }) as PrismaClient<Prisma.PrismaClientOptions, "query">);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optional query performance logging
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    console.log(`Query: ${e.query}`);
    console.log(`Query executed in ${e.duration}ms`);
  });
}
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});