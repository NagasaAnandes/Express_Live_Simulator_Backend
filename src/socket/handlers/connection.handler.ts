import type { Server, Socket } from "socket.io";

import { CLIENT_EVENTS } from "../events/events";
import {
  registerProductHandler,
  syncRecorderProductOverlay,
} from "./product.handler";
import {
  registerDiscountHandler,
  syncRecorderDiscountOverlay,
} from "./discount.handler";
import { roomService } from "../../modules/room/room.service";
import { roomManager } from "../rooms/room.manager";
import {
  emitRoomCreated,
  emitRoomJoined,
  emitRoomUpdated,
  emitRoomError,
} from "../gateway/socket.gateway";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketServerState,
} from "../../types/socket.types";

// Socket connection wiring lives here so future room and role logic stays isolated from server bootstrap.
export function registerConnectionHandler(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketServerState
  >,
): void {
  registerProductHandler(io);
  registerDiscountHandler(io);

  const detachFromCurrentRoom = (
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketServerState
    >,
  ): void => {
    const roomCode = socket.data.roomCode;

    if (!roomCode) {
      return;
    }

    const leaveResult = roomService.removeParticipant(socket.id);

    socket.leave(roomCode);
    socket.data.roomCode = undefined;
    socket.data.role = undefined;

    if (leaveResult?.room) {
      emitRoomUpdated(io, leaveResult.roomCode, leaveResult.room);
    }
  };

  io.on("connection", (socket) => {
    socket.on(CLIENT_EVENTS.CREATE_ROOM, () => {
      detachFromCurrentRoom(socket);

      const roomState = roomService.createRoom(socket.id);

      socket.data.roomCode = roomState.roomCode;
      socket.data.role = roomState.participants[0]?.role;

      socket.join(roomState.roomCode);

      emitRoomCreated(socket, roomManager.toSnapshot(roomState));

      emitRoomUpdated(io, roomState.roomCode, roomState);
    });

    socket.on(CLIENT_EVENTS.JOIN_ROOM, (payload) => {
      detachFromCurrentRoom(socket);

      const joinResult = roomService.joinParticipant(
        payload.roomCode,
        socket.id,
        payload.role,
      );

      if (!joinResult.ok) {
        emitRoomError(socket, joinResult.error);
        return;
      }

      socket.data.roomCode = joinResult.room.roomCode;
      socket.data.role = payload.role;

      socket.join(joinResult.room.roomCode);

      emitRoomJoined(socket, roomManager.toSnapshot(joinResult.room));

      emitRoomUpdated(io, joinResult.room.roomCode, joinResult.room);

      syncRecorderProductOverlay(socket, joinResult.room);
      syncRecorderDiscountOverlay(socket, joinResult.room);
    });

    socket.on(CLIENT_EVENTS.LEAVE_ROOM, () => {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return;
      }

      const leaveResult = roomService.removeParticipant(socket.id);

      socket.leave(roomCode);
      socket.data.roomCode = undefined;
      socket.data.role = undefined;

      if (!leaveResult) {
        return;
      }

      if (leaveResult.room) {
        emitRoomUpdated(io, leaveResult.roomCode, leaveResult.room);
      }
    });

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return;
      }

      const leaveResult = roomService.removeParticipant(socket.id);

      socket.data.roomCode = undefined;
      socket.data.role = undefined;

      if (!leaveResult || !leaveResult.room) {
        return;
      }

      emitRoomUpdated(io, leaveResult.roomCode, leaveResult.room);
    });
  });
}
