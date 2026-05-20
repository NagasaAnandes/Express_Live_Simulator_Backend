import type { RoomState } from "../../types/socket.types";

// Memory-backed room storage is intentionally simple for the first realtime architecture phase.
export const roomStore = new Map<string, RoomState>();

export function clearRoomStore(): void {
  roomStore.clear();
}

export function getRoom(roomCode: string): RoomState | undefined {
  return roomStore.get(roomCode);
}

export function saveRoom(roomState: RoomState): void {
  roomStore.set(roomState.roomCode, roomState);
}

export function deleteRoom(roomCode: string): boolean {
  return roomStore.delete(roomCode);
}
