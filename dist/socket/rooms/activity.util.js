"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoomInactive = isRoomInactive;
exports.touchRoomActivity = touchRoomActivity;
function isRoomInactive(room, thresholdMs = 1000 * 60 * 60) {
    const last = room.lastActivityAt?.getTime() ?? 0;
    return Date.now() - last > thresholdMs;
}
function touchRoomActivity(room) {
    room.lastActivityAt = new Date();
    return room;
}
