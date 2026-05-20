"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Centralized environment parsing keeps runtime configuration explicit and predictable.
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    DATABASE_URL: zod_1.z
        .string()
        .default("mysql://root:root@127.0.0.1:3306/express_live_simulator_backend"),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}
exports.env = parsedEnv.data;
