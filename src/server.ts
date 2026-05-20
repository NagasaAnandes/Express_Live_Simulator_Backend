import cors from "cors";
import express, { type Express } from "express";
import http, { type Server as HttpServer } from "http";
import { Server as SocketIOServer, type ServerOptions } from "socket.io";

import { env } from "./config/env";
import { registerConnectionHandler } from "./socket/handlers/connection.handler";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketServerState,
} from "./types/socket.types";

// Express handles HTTP surface area while Socket.IO handles the realtime transport layer.
export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.status(200).json({
      message: "Mobile Live Commerce Simulator backend is running.",
      status: "ok",
    });
  });

  return app;
}

export function createSocketServer(
  httpServer: HttpServer,
): SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
> {
  const socketOptions: Partial<ServerOptions> = {
    cors: {
      origin: "*",
    },
  };

  const io = new SocketIOServer(httpServer, socketOptions);
  registerConnectionHandler(io);

  return io;
}

function bootstrap(): void {
  const app = createApp();
  const httpServer = http.createServer(app);
  createSocketServer(httpServer);

  const port = Number(process.env.PORT ?? env.PORT);

  httpServer.listen(port, () => {
    console.log("[server] Mobile Live Commerce Simulator backend started.");
    console.log(`[server] HTTP server listening on port ${port}.`);
    console.log("[server] Socket.IO transport initialized.");
    console.log("[server] Health check available at GET /.");
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`[server] Received ${signal}, shutting down gracefully.`);

    httpServer.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void bootstrap();
