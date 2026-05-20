"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const env_1 = require("../config/env");
// Prisma remains a singleton so socket handlers can share one connection pool.
const adapter = new adapter_mariadb_1.PrismaMariaDb(env_1.env.DATABASE_URL);
exports.prisma = new client_1.PrismaClient({ adapter });
