import type { RoomState } from "../../types/socket.types";

export function isRoomInactive(
  room: RoomState,
  thresholdMs = 1000 * 60 * 60,
): boolean {
  const last = room.lastActivityAt?.getTime() ?? 0;
  return Date.now() - last > thresholdMs;
}

export function touchRoomActivity(room: RoomState): RoomState {
  room.lastActivityAt = new Date();
  return room;
}
