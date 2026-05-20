import dotenv from "dotenv";
import { z } from "zod";

// Centralized environment parsing keeps runtime configuration explicit and predictable.
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .default("mysql://root:root@127.0.0.1:3306/express_live_simulator_backend"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment configuration: ${parsedEnv.error.message}`,
  );
}

export type AppEnv = z.infer<typeof envSchema>;

export const env: AppEnv = parsedEnv.data;
