import type { Server, Socket } from "socket.io";

import { SocketClientEvent, SocketServerEvent } from "../events/events";
import { roomManager } from "../rooms/room.manager";
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

    const leaveResult = roomManager.leaveRoom(socket.id);

    socket.leave(roomCode);
    socket.data.roomCode = undefined;
    socket.data.role = undefined;

    if (leaveResult?.room) {
      socket
        .to(leaveResult.roomCode)
        .emit(SocketServerEvent.ROOM_UPDATED, leaveResult.room);
    }
  };

  io.on("connection", (socket) => {
    socket.on(SocketClientEvent.CREATE_ROOM, () => {
      detachFromCurrentRoom(socket);

      const roomState = roomManager.createRoom(socket.id);

      socket.data.roomCode = roomState.roomCode;
      socket.data.role = roomState.participants[0]?.role;

      socket.join(roomState.roomCode);

      socket.emit(
        SocketServerEvent.ROOM_CREATED,
        roomManager.toSnapshot(roomState),
      );

      socket.emit(SocketServerEvent.ROOM_UPDATED, roomState);
    });

    socket.on(SocketClientEvent.JOIN_ROOM, (payload) => {
      detachFromCurrentRoom(socket);

      const joinResult = roomManager.joinRoom(
        payload.roomCode,
        socket.id,
        payload.role,
      );

      if (!joinResult.ok) {
        socket.emit(SocketServerEvent.ROOM_ERROR, joinResult.error);
        return;
      }

      socket.data.roomCode = joinResult.room.roomCode;
      socket.data.role = payload.role;

      socket.join(joinResult.room.roomCode);

      socket.emit(
        SocketServerEvent.ROOM_JOINED,
        roomManager.toSnapshot(joinResult.room),
      );

      io.to(joinResult.room.roomCode).emit(
        SocketServerEvent.ROOM_UPDATED,
        joinResult.room,
      );
    });

    socket.on(SocketClientEvent.LEAVE_ROOM, () => {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return;
      }

      const leaveResult = roomManager.leaveRoom(socket.id);

      socket.leave(roomCode);
      socket.data.roomCode = undefined;
      socket.data.role = undefined;

      if (!leaveResult) {
        return;
      }

      if (leaveResult.room) {
        socket.emit(SocketServerEvent.ROOM_UPDATED, leaveResult.room);
        socket
          .to(leaveResult.roomCode)
          .emit(SocketServerEvent.ROOM_UPDATED, leaveResult.room);
      }
    });

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return;
      }

      const leaveResult = roomManager.leaveRoom(socket.id);

      socket.data.roomCode = undefined;
      socket.data.role = undefined;

      if (!leaveResult || !leaveResult.room) {
        return;
      }

      socket
        .to(leaveResult.roomCode)
        .emit(SocketServerEvent.ROOM_UPDATED, leaveResult.room);
    });
  });
}
