"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.createSocketServer = createSocketServer;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const env_1 = require("./config/env");
const connection_handler_1 = require("./socket/handlers/connection.handler");
// Express handles HTTP surface area while Socket.IO handles the realtime transport layer.
function createApp() {
    const app = (0, express_1.default)();
    app.disable("x-powered-by");
    app.use((0, cors_1.default)({ origin: "*" }));
    app.use(express_1.default.json());
    app.get("/", (_request, response) => {
        response.status(200).json({
            message: "Mobile Live Commerce Simulator backend is running.",
            status: "ok",
        });
    });
    return app;
}
function createSocketServer(httpServer) {
    const socketOptions = {
        cors: {
            origin: "*",
        },
    };
    const io = new socket_io_1.Server(httpServer, socketOptions);
    (0, connection_handler_1.registerConnectionHandler)(io);
    return io;
}
function bootstrap() {
    const app = createApp();
    const httpServer = http_1.default.createServer(app);
    createSocketServer(httpServer);
    const port = Number(process.env.PORT ?? env_1.env.PORT);
    httpServer.listen(port, () => {
        console.log("[server] Mobile Live Commerce Simulator backend started.");
        console.log(`[server] HTTP server listening on port ${port}.`);
        console.log("[server] Socket.IO transport initialized.");
        console.log("[server] Health check available at GET /.");
    });
    const shutdown = (signal) => {
        console.log(`[server] Received ${signal}, shutting down gracefully.`);
        httpServer.close(() => {
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
void bootstrap();
