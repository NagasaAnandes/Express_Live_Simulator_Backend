"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnectionHandler = registerConnectionHandler;
const events_1 = require("../events/events");
const product_handler_1 = require("./product.handler");
const room_service_1 = require("../../modules/room/room.service");
const room_manager_1 = require("../rooms/room.manager");
const socket_gateway_1 = require("../gateway/socket.gateway");
// Socket connection wiring lives here so future room and role logic stays isolated from server bootstrap.
function registerConnectionHandler(io) {
    (0, product_handler_1.registerProductHandler)(io);
    const detachFromCurrentRoom = (socket) => {
        const roomCode = socket.data.roomCode;
        if (!roomCode) {
            return;
        }
        const leaveResult = room_service_1.roomService.removeParticipant(socket.id);
        socket.leave(roomCode);
        socket.data.roomCode = undefined;
        socket.data.role = undefined;
        if (leaveResult?.room) {
            (0, socket_gateway_1.emitRoomUpdated)(io, leaveResult.roomCode, leaveResult.room);
        }
    };
    io.on("connection", (socket) => {
        socket.on(events_1.CLIENT_EVENTS.CREATE_ROOM, () => {
            detachFromCurrentRoom(socket);
            const roomState = room_service_1.roomService.createRoom(socket.id);
            socket.data.roomCode = roomState.roomCode;
            socket.data.role = roomState.participants[0]?.role;
            socket.join(roomState.roomCode);
            (0, socket_gateway_1.emitRoomCreated)(socket, room_manager_1.roomManager.toSnapshot(roomState));
            (0, socket_gateway_1.emitRoomUpdated)(io, roomState.roomCode, roomState);
        });
        socket.on(events_1.CLIENT_EVENTS.JOIN_ROOM, (payload) => {
            detachFromCurrentRoom(socket);
            const joinResult = room_service_1.roomService.joinParticipant(payload.roomCode, socket.id, payload.role);
            if (!joinResult.ok) {
                (0, socket_gateway_1.emitRoomError)(socket, joinResult.error);
                return;
            }
            socket.data.roomCode = joinResult.room.roomCode;
            socket.data.role = payload.role;
            socket.join(joinResult.room.roomCode);
            (0, socket_gateway_1.emitRoomJoined)(socket, room_manager_1.roomManager.toSnapshot(joinResult.room));
            (0, socket_gateway_1.emitRoomUpdated)(io, joinResult.room.roomCode, joinResult.room);
            (0, product_handler_1.syncRecorderProductOverlay)(socket, joinResult.room);
        });
        socket.on(events_1.CLIENT_EVENTS.LEAVE_ROOM, () => {
            const roomCode = socket.data.roomCode;
            if (!roomCode) {
                return;
            }
            const leaveResult = room_service_1.roomService.removeParticipant(socket.id);
            socket.leave(roomCode);
            socket.data.roomCode = undefined;
            socket.data.role = undefined;
            if (!leaveResult) {
                return;
            }
            if (leaveResult.room) {
                (0, socket_gateway_1.emitRoomUpdated)(io, leaveResult.roomCode, leaveResult.room);
            }
        });
        socket.on("disconnect", () => {
            const roomCode = socket.data.roomCode;
            if (!roomCode) {
                return;
            }
            const leaveResult = room_service_1.roomService.removeParticipant(socket.id);
            socket.data.roomCode = undefined;
            socket.data.role = undefined;
            if (!leaveResult || !leaveResult.room) {
                return;
            }
            (0, socket_gateway_1.emitRoomUpdated)(io, leaveResult.roomCode, leaveResult.room);
        });
    });
}
