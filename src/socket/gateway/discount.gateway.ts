import type { Server, Socket } from "socket.io";

import { SERVER_EVENTS } from "../events/events";
import type {
  ClientToServerEvents,
  DiscountClearedPayload,
  DiscountErrorPayload,
  DiscountUpdatedPayload,
  InterServerEvents,
  ServerToClientEvents,
  SocketServerState,
} from "../../types/socket.types";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "./builders/response.builder";

type RealtimeServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
>;

type RealtimeSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
>;

export function emitDiscountUpdated(
  io: RealtimeServer,
  roomCode: string,
  payload: DiscountUpdatedPayload,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.DISCOUNT_UPDATED,
    buildSuccessResponse(payload),
  );
}

export function emitDiscountUpdatedToSocket(
  socket: RealtimeSocket,
  payload: DiscountUpdatedPayload,
): void {
  socket.emit(SERVER_EVENTS.DISCOUNT_UPDATED, buildSuccessResponse(payload));
}

export function emitDiscountCleared(
  io: RealtimeServer,
  roomCode: string,
  payload: DiscountClearedPayload,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.DISCOUNT_CLEARED,
    buildSuccessResponse(payload),
  );
}

export function emitDiscountError(
  socket: RealtimeSocket,
  payload: DiscountErrorPayload,
): void {
  socket.emit(
    SERVER_EVENTS.DISCOUNT_ERROR,
    buildErrorResponse(payload.code, payload.message, {
      roomCode: payload.roomCode,
      type: payload.type,
    }),
  );
}