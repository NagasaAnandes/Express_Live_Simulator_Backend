"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnectionHandler = registerConnectionHandler;
const events_1 = require("../events/events");
const room_manager_1 = require("../rooms/room.manager");
// Socket connection wiring lives here so future room and role logic stays isolated from server bootstrap.
function registerConnectionHandler(io) {
    const detachFromCurrentRoom = (socket) => {
        const roomCode = socket.data.roomCode;
        if (!roomCode) {
            return;
        }
        const leaveResult = room_manager_1.roomManager.leaveRoom(socket.id);
        socket.leave(roomCode);
        socket.data.roomCode = undefined;
        socket.data.role = undefined;
        if (leaveResult?.room) {
            socket
                .to(leaveResult.roomCode)
                .emit(events_1.SocketServerEvent.ROOM_UPDATED, leaveResult.room);
        }
    };
    io.on("connection", (socket) => {
        socket.on(events_1.SocketClientEvent.CREATE_ROOM, () => {
            detachFromCurrentRoom(socket);
            const roomState = room_manager_1.roomManager.createRoom(socket.id);
            socket.data.roomCode = roomState.roomCode;
            socket.data.role = roomState.participants[0]?.role;
            socket.join(roomState.roomCode);
            socket.emit(events_1.SocketServerEvent.ROOM_CREATED, room_manager_1.roomManager.toSnapshot(roomState));
            socket.emit(events_1.SocketServerEvent.ROOM_UPDATED, roomState);
        });
        socket.on(events_1.SocketClientEvent.JOIN_ROOM, (payload) => {
            detachFromCurrentRoom(socket);
            const joinResult = room_manager_1.roomManager.joinRoom(payload.roomCode, socket.id, payload.role);
            if (!joinResult.ok) {
                socket.emit(events_1.SocketServerEvent.ROOM_ERROR, joinResult.error);
                return;
            }
            socket.data.roomCode = joinResult.room.roomCode;
            socket.data.role = payload.role;
            socket.join(joinResult.room.roomCode);
            socket.emit(events_1.SocketServerEvent.ROOM_JOINED, room_manager_1.roomManager.toSnapshot(joinResult.room));
            io.to(joinResult.room.roomCode).emit(events_1.SocketServerEvent.ROOM_UPDATED, joinResult.room);
        });
        socket.on(events_1.SocketClientEvent.LEAVE_ROOM, () => {
            const roomCode = socket.data.roomCode;
            if (!roomCode) {
                return;
            }
            const leaveResult = room_manager_1.roomManager.leaveRoom(socket.id);
            socket.leave(roomCode);
            socket.data.roomCode = undefined;
            socket.data.role = undefined;
            if (!leaveResult) {
                return;
            }
            if (leaveResult.room) {
                socket.emit(events_1.SocketServerEvent.ROOM_UPDATED, leaveResult.room);
                socket
                    .to(leaveResult.roomCode)
                    .emit(events_1.SocketServerEvent.ROOM_UPDATED, leaveResult.room);
            }
        });
        socket.on("disconnect", () => {
            const roomCode = socket.data.roomCode;
            if (!roomCode) {
                return;
            }
            const leaveResult = room_manager_1.roomManager.leaveRoom(socket.id);
            socket.data.roomCode = undefined;
            socket.data.role = undefined;
            if (!leaveResult || !leaveResult.room) {
                return;
            }
            socket
                .to(leaveResult.roomCode)
                .emit(events_1.SocketServerEvent.ROOM_UPDATED, leaveResult.room);
        });
    });
}
