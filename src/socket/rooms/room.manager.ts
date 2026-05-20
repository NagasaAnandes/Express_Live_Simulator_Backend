import type { RoomState } from "../../types/socket.types";
import { roomStore } from "../state/room.store";

// RoomManager provides a single place for in-memory room lifecycle access.
export class RoomManager {
  public getRoom(roomCode: string): RoomState | undefined {
    return roomStore.get(roomCode);
  }

  public saveRoom(roomState: RoomState): void {
    roomStore.set(roomState.roomCode, roomState);
  }

  public removeRoom(roomCode: string): boolean {
    return roomStore.delete(roomCode);
  }

  public listRooms(): RoomState[] {
    return Array.from(roomStore.values());
  }
}

export const roomManager = new RoomManager();
