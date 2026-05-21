import type { Server, Socket } from "socket.io";

import { CLIENT_EVENTS } from "../events/events";
import { discountService } from "../../modules/discount/discount.service";
import {
  type ClientToServerEvents,
  type DiscountClearedPayload,
  ParticipantRole,
  type DiscountStartPayload,
  type DiscountStopPayload,
  type InterServerEvents,
  type RoomState,
  type ServerToClientEvents,
  type SocketServerState,
  type DiscountUpdatedPayload,
} from "../../types/socket.types";
import {
  emitDiscountCleared,
  emitDiscountError,
  emitDiscountUpdated,
  emitDiscountUpdatedToSocket,
} from "../gateway/discount.gateway";
import { emitRoomUpdated } from "../gateway/socket.gateway";

type RealtimeSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
>;

type RealtimeServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
>;

export function syncRecorderDiscountOverlay(
  socket: RealtimeSocket,
  roomState: RoomState,
): void {
  if (!roomState.activeDiscount || socket.data.role !== ParticipantRole.RECORDER) {
    return;
  }

  emitDiscountUpdatedToSocket(socket, {
    roomCode: roomState.roomCode,
    discount: roomState.activeDiscount,
  });
}

export function registerDiscountHandler(io: RealtimeServer): void {
  io.on("connection", (socket) => {
    socket.on(CLIENT_EVENTS.START_DISCOUNT, (payload: DiscountStartPayload) => {
      const result = discountService.startDiscount(
        socket.data.roomCode,
        socket.data.role,
        payload,
      );

      if (!result.ok) {
        emitDiscountError(socket, result.error);
        return;
      }

      const updatedPayload: DiscountUpdatedPayload = {
        roomCode: result.room.roomCode,
        discount: result.discount ?? result.room.activeDiscount!,
      };

      emitDiscountUpdated(io, result.room.roomCode, updatedPayload);
      emitRoomUpdated(io, result.room.roomCode, result.room);
    });

    socket.on(CLIENT_EVENTS.STOP_DISCOUNT, (payload: DiscountStopPayload) => {
      const result = discountService.stopDiscount(
        socket.data.roomCode,
        socket.data.role,
        payload,
      );

      if (!result.ok) {
        emitDiscountError(socket, result.error);
        return;
      }

      const clearedPayload: DiscountClearedPayload = {
        roomCode: result.room.roomCode,
      };

      emitDiscountCleared(io, result.room.roomCode, clearedPayload);
      emitRoomUpdated(io, result.room.roomCode, result.room);
    });
  });
}