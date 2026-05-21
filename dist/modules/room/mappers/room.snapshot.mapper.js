"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRoomSnapshot = toRoomSnapshot;
function toRoomSnapshot(room) {
    const roles = {
        recorder: false,
        operator: false,
        commenter: false,
    };
    for (const p of room.participants) {
        if (p.role === "RECORDER")
            roles.recorder = true;
        if (p.role === "OPERATOR")
            roles.operator = true;
        if (p.role === "COMMENTER")
            roles.commenter = true;
    }
    return {
        roomCode: room.roomCode,
        participants: roles,
        lastActivityAt: room.lastActivityAt,
    };
}
