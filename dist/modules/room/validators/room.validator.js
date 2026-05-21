"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoomExists = validateRoomExists;
exports.validateRole = validateRole;
exports.validateRoleNotTaken = validateRoleNotTaken;
exports.validateRoomCapacity = validateRoomCapacity;
const room_manager_1 = require("../../../socket/rooms/room.manager");
const socket_types_1 = require("../../../types/socket.types");
const error_types_1 = require("../../../types/error.types");
function validateRoomExists(roomCode) {
    const room = room_manager_1.roomManager.getRoom(roomCode);
    if (!room) {
        return {
            code: error_types_1.RoomErrorCode.ROOM_NOT_FOUND,
            message: "Room not found.",
            details: { roomCode },
        };
    }
    return null;
}
function validateRole(role) {
    if (!Object.values(socket_types_1.ParticipantRole).includes(role)) {
        return {
            code: error_types_1.RoomErrorCode.INVALID_ROLE,
            message: "Invalid role.",
            details: { role },
        };
    }
    return null;
}
function validateRoleNotTaken(room, role) {
    if (room.participants.some((p) => p.role === role)) {
        return {
            code: error_types_1.RoomErrorCode.ROLE_ALREADY_USED,
            message: "That role is already taken.",
            details: { role },
        };
    }
    return null;
}
function validateRoomCapacity(room, max = 3) {
    if (room.participants.length >= max) {
        return {
            code: error_types_1.RoomErrorCode.ROOM_FULL,
            message: "Room is full.",
            details: { max },
        };
    }
    return null;
}
