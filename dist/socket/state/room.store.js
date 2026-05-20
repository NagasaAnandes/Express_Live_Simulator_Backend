"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomStore = void 0;
exports.clearRoomStore = clearRoomStore;
exports.getRoom = getRoom;
exports.saveRoom = saveRoom;
exports.deleteRoom = deleteRoom;
// Memory-backed room storage is intentionally simple for the first realtime architecture phase.
exports.roomStore = new Map();
function clearRoomStore() {
    exports.roomStore.clear();
}
function getRoom(roomCode) {
    return exports.roomStore.get(roomCode);
}
function saveRoom(roomState) {
    exports.roomStore.set(roomState.roomCode, roomState);
}
function deleteRoom(roomCode) {
    return exports.roomStore.delete(roomCode);
}
