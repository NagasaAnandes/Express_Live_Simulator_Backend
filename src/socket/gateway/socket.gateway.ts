import type { Server, Socket } from "socket.io";

import { SERVER_EVENTS } from "../events/events";
import type {
  ProductClearPayload,
  ProductOverlayPayload,
  RoomState,
  RoomErrorPayload,
  ProductErrorPayload,
  ServerToClientEvents,
  SocketServerState,
  ClientToServerEvents,
  InterServerEvents,
  RoomSnapshot,
} from "../../types/socket.types";
import {
  buildSuccessResponse,
  buildErrorResponse,
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

export function emitRoomUpdated(
  io: RealtimeServer,
  roomCode: string,
  roomState: RoomState,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.ROOM_UPDATED,
    buildSuccessResponse(roomState),
  );
}

export function emitRoomCreated(
  socket: RealtimeSocket,
  payload: RoomSnapshot,
): void {
  socket.emit(SERVER_EVENTS.ROOM_CREATED, buildSuccessResponse(payload));
}

export function emitRoomJoined(
  socket: RealtimeSocket,
  payload: RoomSnapshot,
): void {
  socket.emit(SERVER_EVENTS.ROOM_JOINED, buildSuccessResponse(payload));
}

export function emitProductUpdated(
  io: RealtimeServer,
  roomCode: string,
  payload: ProductOverlayPayload,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.PRODUCT_UPDATED,
    buildSuccessResponse(payload),
  );
}

export function emitProductUpdatedToSocket(
  socket: RealtimeSocket,
  payload: ProductOverlayPayload,
): void {
  socket.emit(SERVER_EVENTS.PRODUCT_UPDATED, buildSuccessResponse(payload));
}

export function emitProductCleared(
  io: RealtimeServer,
  roomCode: string,
  payload: ProductClearPayload,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.PRODUCT_CLEARED,
    buildSuccessResponse(payload),
  );
}

export function emitRoomError(
  socket: RealtimeSocket,
  payload: RoomErrorPayload,
): void {
  socket.emit(
    SERVER_EVENTS.ROOM_ERROR,
    buildErrorResponse(payload.code, payload.message, {
      roomCode: payload.roomCode,
    }),
  );
}

export function emitProductError(
  socket: RealtimeSocket,
  payload: ProductErrorPayload,
): void {
  socket.emit(
    SERVER_EVENTS.PRODUCT_ERROR,
    buildErrorResponse(payload.code, payload.message, {
      roomCode: payload.roomCode,
      productId: payload.productId,
    }),
  );
}
