import { defineConfig } from "prisma/config";

const DEFAULT_DATABASE_URL =
  "mysql://root:root@127.0.0.1:3306/express_live_simulator_backend";

const databaseUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : DEFAULT_DATABASE_URL;

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
