import {
  ParticipantRole,
  type RoomParticipant,
  type RoomState,
  type RoomErrorPayload,
} from "../../types/socket.types";
import { RoomErrorCode } from "../../socket/events/events";
import { roomManager } from "../../socket/rooms/room.manager";
import {
  validateRoomExists,
  validateRole,
  validateRoleNotTaken,
  validateRoomCapacity,
} from "./validators/room.validator";

export interface RoomJoinResult {
  ok: true;
  room: RoomState;
}

export interface RoomJoinErrorResult {
  ok: false;
  error: RoomErrorPayload;
}

export type RoomJoinResponse = RoomJoinResult | RoomJoinErrorResult;

// RoomService implements business validation around room lifecycle while delegating
// pure state mutations to RoomManager. This keeps the manager a small, testable
// state container and moves policy into the service layer.
export class RoomService {
  public getRoomState(roomCode: string): RoomState | undefined {
    return roomManager.getRoom(roomCode);
  }

  public createRoom(socketId: string): RoomState {
    return roomManager.createRoom(socketId);
  }

  public saveRoomState(roomState: RoomState): void {
    roomManager.saveRoom(roomState);
  }

  public deleteRoom(roomCode: string): boolean {
    return roomManager.deleteRoom(roomCode);
  }

  public joinParticipant(
    roomCode: string,
    socketId: string,
    role: string,
  ): RoomJoinResponse {
    const room = roomManager.getRoom(roomCode);

    const existsError = validateRoomExists(roomCode);
    if (existsError) {
      return { ok: false, error: existsError };
    }

    const roleError = validateRole(role);
    if (roleError) {
      return { ok: false, error: roleError };
    }

    // At this point room is guaranteed to exist per validateRoomExists
    const currentRoom = room as RoomState;

    const duplicateRoleError = validateRoleNotTaken(currentRoom, role);
    if (duplicateRoleError) {
      return { ok: false, error: duplicateRoleError };
    }

    const capacityError = validateRoomCapacity(currentRoom);
    if (capacityError) {
      return { ok: false, error: capacityError };
    }

    const joined = roomManager.joinParticipant(roomCode, {
      socketId,
      role: role as ParticipantRole,
    });

    return {
      ok: true,
      room: joined as RoomState,
    };
  }

  public removeParticipant(socketId: string) {
    return roomManager.removeParticipant(socketId);
  }
}

export const roomService = new RoomService();
