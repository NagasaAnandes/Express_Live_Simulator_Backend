import { roomManager } from "../../../socket/rooms/room.manager";
import { ParticipantRole } from "../../../types/socket.types";
import type { RoomState } from "../../../types/socket.types";
import type { ErrorPayload } from "../../../types/error.types";
import { RoomErrorCode } from "../../../types/error.types";

export function validateRoomExists(roomCode: string): ErrorPayload | null {
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    return {
      code: RoomErrorCode.ROOM_NOT_FOUND,
      message: "Room not found.",
      details: { roomCode },
    };
  }

  return null;
}

export function validateRole(role: string): ErrorPayload | null {
  if (!Object.values(ParticipantRole).includes(role as ParticipantRole)) {
    return {
      code: RoomErrorCode.INVALID_ROLE,
      message: "Invalid role.",
      details: { role },
    };
  }

  return null;
}

export function validateRoleNotTaken(
  room: RoomState,
  role: string,
): ErrorPayload | null {
  if (room.participants.some((p) => p.role === role)) {
    return {
      code: RoomErrorCode.ROLE_ALREADY_USED,
      message: "That role is already taken.",
      details: { role },
    };
  }

  return null;
}

export function validateRoomCapacity(
  room: RoomState,
  max = 3,
): ErrorPayload | null {
  if (room.participants.length >= max) {
    return {
      code: RoomErrorCode.ROOM_FULL,
      message: "Room is full.",
      details: { max },
    };
  }

  return null;
}
