"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomManager = exports.RoomManager = void 0;
const room_store_1 = require("../state/room.store");
// RoomManager provides a single place for in-memory room lifecycle access.
class RoomManager {
    getRoom(roomCode) {
        return room_store_1.roomStore.get(roomCode);
    }
    saveRoom(roomState) {
        room_store_1.roomStore.set(roomState.roomCode, roomState);
    }
    removeRoom(roomCode) {
        return room_store_1.roomStore.delete(roomCode);
    }
    listRooms() {
        return Array.from(room_store_1.roomStore.values());
    }
}
exports.RoomManager = RoomManager;
exports.roomManager = new RoomManager();
