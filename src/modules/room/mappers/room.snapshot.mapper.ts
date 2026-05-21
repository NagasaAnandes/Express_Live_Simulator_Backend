import type { RoomState, RoomSnapshot } from "../../../types/socket.types";

export function toRoomSnapshot(room: RoomState): RoomSnapshot {
  const roles = {
    recorder: false,
    operator: false,
    commenter: false,
  };

  for (const p of room.participants) {
    if (p.role === "RECORDER") roles.recorder = true;
    if (p.role === "OPERATOR") roles.operator = true;
    if (p.role === "COMMENTER") roles.commenter = true;
  }

  return {
    roomCode: room.roomCode,
    participants: roles,
    lastActivityAt: room.lastActivityAt,
  };
}
