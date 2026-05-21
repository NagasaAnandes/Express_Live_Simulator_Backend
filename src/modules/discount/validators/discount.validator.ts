import { roomManager } from "../../../socket/rooms/room.manager";
import { DiscountErrorCode } from "../../../types/error.types";
import {
  DiscountType,
  ParticipantRole,
  type DiscountErrorPayload,
  type DiscountStartPayload,
  type DiscountStopPayload,
} from "../../../types/socket.types";

const DISCOUNT_ERROR_MESSAGES: Record<DiscountErrorCode, string> = {
  [DiscountErrorCode.ROOM_NOT_FOUND]: "Room not found.",
  [DiscountErrorCode.ROOM_MISMATCH]: "Socket is not attached to that room.",
  [DiscountErrorCode.INVALID_ROLE]:
    "Only the operator can manage the discount overlay.",
  [DiscountErrorCode.INVALID_TYPE]: "Invalid discount type.",
  [DiscountErrorCode.INVALID_VALUE]: "Invalid discount value.",
  [DiscountErrorCode.LABEL_REQUIRED]: "Discount label is required.",
};

function createDiscountError(
  code: DiscountErrorCode,
  roomCode?: string,
  type?: DiscountType,
): DiscountErrorPayload {
  return {
    code,
    message: DISCOUNT_ERROR_MESSAGES[code],
    roomCode,
    type,
  };
}

function hasLabel(label: string | undefined): boolean {
  return typeof label === "string" && label.trim().length > 0;
}

export function validateDiscountType(type: string): DiscountErrorPayload | null {
  if (!Object.values(DiscountType).includes(type as DiscountType)) {
    return createDiscountError(DiscountErrorCode.INVALID_TYPE, undefined);
  }

  return null;
}

export function validateDiscountRoomAccess(
  roomCode: string,
  socketRoomCode: string | undefined,
  role: ParticipantRole | undefined,
): DiscountErrorPayload | null {
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    return createDiscountError(DiscountErrorCode.ROOM_NOT_FOUND, roomCode);
  }

  if (!socketRoomCode || socketRoomCode !== roomCode) {
    return createDiscountError(DiscountErrorCode.ROOM_MISMATCH, roomCode);
  }

  if (role !== ParticipantRole.OPERATOR) {
    return createDiscountError(DiscountErrorCode.INVALID_ROLE, roomCode);
  }

  return null;
}

export function validateStartDiscountPayload(
  payload: DiscountStartPayload,
): DiscountErrorPayload | null {
  const typeError = validateDiscountType(payload.type);

  if (typeError) {
    return createDiscountError(
      DiscountErrorCode.INVALID_TYPE,
      payload.roomCode,
    );
  }

  const requiresLabel =
    payload.type !== DiscountType.FREE_SHIPPING;

  if (requiresLabel && !hasLabel(payload.label)) {
    return createDiscountError(DiscountErrorCode.LABEL_REQUIRED, payload.roomCode, payload.type);
  }

  switch (payload.type) {
    case DiscountType.PERCENTAGE: {
      if (typeof payload.value !== "number" || !Number.isFinite(payload.value)) {
        return createDiscountError(
          DiscountErrorCode.INVALID_VALUE,
          payload.roomCode,
          payload.type,
        );
      }

      if (payload.value < 1 || payload.value > 100) {
        return createDiscountError(
          DiscountErrorCode.INVALID_VALUE,
          payload.roomCode,
          payload.type,
        );
      }

      return null;
    }
    case DiscountType.FIXED: {
      if (typeof payload.value !== "number" || !Number.isFinite(payload.value)) {
        return createDiscountError(
          DiscountErrorCode.INVALID_VALUE,
          payload.roomCode,
          payload.type,
        );
      }

      if (payload.value <= 0) {
        return createDiscountError(
          DiscountErrorCode.INVALID_VALUE,
          payload.roomCode,
          payload.type,
        );
      }

      return null;
    }
    case DiscountType.FLASH_SALE:
    case DiscountType.FREE_SHIPPING:
      return null;
    default:
      return createDiscountError(
        DiscountErrorCode.INVALID_TYPE,
        payload.roomCode,
        payload.type,
      );
  }
}

export function validateStopDiscountPayload(
  payload: DiscountStopPayload,
): DiscountErrorPayload | null {
  if (typeof payload.roomCode !== "string" || payload.roomCode.trim().length === 0) {
    return createDiscountError(DiscountErrorCode.ROOM_NOT_FOUND);
  }

  return null;
}