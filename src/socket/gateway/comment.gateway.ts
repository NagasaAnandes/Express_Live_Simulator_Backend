import type { Server, Socket } from "socket.io";

import { SERVER_EVENTS } from "../events/events";
import type {
  ClientToServerEvents,
  CommentErrorPayload,
  CommentQueueUpdatedPayload,
  CommentReceivedPayload,
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

export function emitCommentReceived(
  io: RealtimeServer,
  roomCode: string,
  payload: CommentReceivedPayload,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.COMMENT_RECEIVED,
    buildSuccessResponse(payload),
  );
}

export function emitCommentQueueUpdated(
  io: RealtimeServer,
  roomCode: string,
  payload: CommentQueueUpdatedPayload,
): void {
  io.to(roomCode).emit(
    SERVER_EVENTS.COMMENT_QUEUE_UPDATED,
    buildSuccessResponse(payload),
  );
}

export function emitCommentQueueUpdatedToSocket(
  socket: RealtimeSocket,
  payload: CommentQueueUpdatedPayload,
): void {
  socket.emit(
    SERVER_EVENTS.COMMENT_QUEUE_UPDATED,
    buildSuccessResponse(payload),
  );
}

export function emitCommentError(
  socket: RealtimeSocket,
  payload: CommentErrorPayload,
): void {
  socket.emit(
    SERVER_EVENTS.COMMENT_ERROR,
    buildErrorResponse(payload.code, payload.message, {
      roomCode: payload.roomCode,
      category: payload.category,
    }),
  );
}
