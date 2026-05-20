import type { RoomState } from "../../types/socket.types";
import { roomManager } from "../../socket/rooms/room.manager";

// Domain service placeholder for room-related realtime operations.
export class RoomService {
  public getRoomState(roomCode: string): RoomState | undefined {
    return roomManager.getRoom(roomCode);
  }

  public saveRoomState(roomState: RoomState): void {
    roomManager.saveRoom(roomState);
  }

  public removeRoomState(roomCode: string): boolean {
    return roomManager.removeRoom(roomCode);
  }
}

export const roomService = new RoomService();
