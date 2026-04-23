import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";
import ms from "ms";

const durationSchema = z
  .string()
  .refine((val) => {
    const parsed = ms(val as ms.StringValue);
    return typeof parsed === "number" && parsed > 0;
  }, {
    message: "Must be a valid duration (e.g., 15m, 1h, 7d)",
});

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((s) => (s ? Number(s) : 3000))
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: "PORT must be a positive integer",
  }),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid connection string"),

  REDIS_HOST: z.string().default("localhost"),

  REDIS_PORT: z
    .string()
    .optional()
    .transform((s) => (s ? Number(s) : 6379)),

  REDIS_PASSWORD: z.string().optional(),

  EMAIL_SENDER: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),

  APP_ORIGIN: z.string().optional(),

  APP_NAME: z.string().optional(),

  JWT_EXPIRES_IN: durationSchema.default("1h"),

  JWT_REFRESH_EXPIRES_IN: durationSchema.default("7d"),
  
  AADHAR_SALT: z.string().min(32, "AADHAR_SALT must be at least 32 characters"),
});



const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

function deepFreeze<T>(obj: T): Readonly<T> {
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = (obj as any)[key];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

let parsed: ReturnType<typeof envSchema.safeParse>;

try {
  parsed = envSchema.safeParse(process.env);
} catch (err) {
  console.warn("Zod validation failed or unavailable. Using fallback validator.");
  parsed = { success: false, error: err as Error } as any;
}

if (!parsed.success) {
  if (parsed.error && "format" in parsed.error) {
    console.error("Environment validation error:");
    console.error(parsed.error);
  } else {
    console.error("Environment validation failed:", parsed.error);
  }

  console.error("The app cannot start with invalid environment variables.");
  process.exit(1);
}
const env = parsed.data ?? {
  PORT: Number(getEnv("PORT", "3000")),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  REDIS_HOST: getEnv("REDIS_HOST", "localhost"),
  REDIS_PORT: Number(getEnv("REDIS_PORT", "6379")),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  EMAIL_SENDER: process.env.EMAIL_SENDER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  APP_ORIGIN: process.env.APP_ORIGIN,
  APP_NAME: process.env.APP_NAME,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  AADHAR_SALT: getEnv("AADHAR_SALT"),
};


export const configEnv = deepFreeze({
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  databaseUrl: env.DATABASE_URL,
  redisHost: env.REDIS_HOST,
  redisPort: env.REDIS_PORT,
  redisPassword: env.REDIS_PASSWORD,
  emailSender: env.EMAIL_SENDER,
  resendApiKey: env.RESEND_API_KEY,
  appOrigin: env.APP_ORIGIN,
  appName: env.APP_NAME,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  jwtExpiresInMs: ms(env.JWT_EXPIRES_IN as ms.StringValue),
  jwtRefreshExpiresInMs: ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue),
  aadharSalt: env.AADHAR_SALT,
} as const);