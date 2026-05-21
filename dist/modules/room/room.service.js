"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = exports.RoomService = void 0;
const room_manager_1 = require("../../socket/rooms/room.manager");
const room_validator_1 = require("./validators/room.validator");
// RoomService implements business validation around room lifecycle while delegating
// pure state mutations to RoomManager. This keeps the manager a small, testable
// state container and moves policy into the service layer.
class RoomService {
    getRoomState(roomCode) {
        return room_manager_1.roomManager.getRoom(roomCode);
    }
    createRoom(socketId) {
        return room_manager_1.roomManager.createRoom(socketId);
    }
    saveRoomState(roomState) {
        room_manager_1.roomManager.saveRoom(roomState);
    }
    deleteRoom(roomCode) {
        return room_manager_1.roomManager.deleteRoom(roomCode);
    }
    joinParticipant(roomCode, socketId, role) {
        const room = room_manager_1.roomManager.getRoom(roomCode);
        const existsError = (0, room_validator_1.validateRoomExists)(roomCode);
        if (existsError) {
            return { ok: false, error: existsError };
        }
        const roleError = (0, room_validator_1.validateRole)(role);
        if (roleError) {
            return { ok: false, error: roleError };
        }
        // At this point room is guaranteed to exist per validateRoomExists
        const currentRoom = room;
        const duplicateRoleError = (0, room_validator_1.validateRoleNotTaken)(currentRoom, role);
        if (duplicateRoleError) {
            return { ok: false, error: duplicateRoleError };
        }
        const capacityError = (0, room_validator_1.validateRoomCapacity)(currentRoom);
        if (capacityError) {
            return { ok: false, error: capacityError };
        }
        const joined = room_manager_1.roomManager.joinParticipant(roomCode, {
            socketId,
            role: role,
        });
        return {
            ok: true,
            room: joined,
        };
    }
    removeParticipant(socketId) {
        return room_manager_1.roomManager.removeParticipant(socketId);
    }
}
exports.RoomService = RoomService;
exports.roomService = new RoomService();
