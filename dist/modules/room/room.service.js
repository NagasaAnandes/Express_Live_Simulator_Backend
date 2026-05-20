"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = exports.RoomService = void 0;
const room_manager_1 = require("../../socket/rooms/room.manager");
// Domain service placeholder for room-related realtime operations.
class RoomService {
    getRoomState(roomCode) {
        return room_manager_1.roomManager.getRoom(roomCode);
    }
    saveRoomState(roomState) {
        room_manager_1.roomManager.saveRoom(roomState);
    }
    removeRoomState(roomCode) {
        return room_manager_1.roomManager.removeRoom(roomCode);
    }
}
exports.RoomService = RoomService;
exports.roomService = new RoomService();
