import type { ErrorPayload } from "../../types/error.types";
import { DiscountErrorCode } from "../../types/error.types";
import { roomManager } from "../../socket/rooms/room.manager";
import {
  type ActiveDiscountOverlay,
  ParticipantRole,
  type DiscountStartPayload,
  type DiscountStopPayload,
  type DiscountErrorPayload,
  type RoomState,
} from "../../types/socket.types";
import { mapStartDiscountPayloadToOverlay } from "./mappers/discount.mapper";
import {
  validateDiscountRoomAccess,
  validateStartDiscountPayload,
  validateStopDiscountPayload,
} from "./validators/discount.validator";

export interface DiscountOperationResult {
  ok: true;
  room: RoomState;
  discount?: ActiveDiscountOverlay;
}

export interface DiscountOperationErrorResult {
  ok: false;
  error: DiscountErrorPayload;
}

export type DiscountOperationResponse =
  | DiscountOperationResult
  | DiscountOperationErrorResult;

const DEFAULT_ROOM_NOT_FOUND_ERROR: DiscountErrorPayload = {
  code: DiscountErrorCode.ROOM_NOT_FOUND,
  message: "Room not found.",
};

// DiscountService owns the business orchestration for transient room discount state.
export class DiscountService {
  public startDiscount(
    socketRoomCode: string | undefined,
    socketRole: ParticipantRole | undefined,
    payload: DiscountStartPayload,
  ): DiscountOperationResponse {
    const accessError = validateDiscountRoomAccess(
      payload.roomCode,
      socketRoomCode,
      socketRole,
    );

    if (accessError) {
      return { ok: false, error: accessError };
    }

    const payloadError = validateStartDiscountPayload(payload);

    if (payloadError) {
      return { ok: false, error: payloadError };
    }

    const activeDiscount = mapStartDiscountPayloadToOverlay(payload);
    const updatedRoom = roomManager.setDiscountState(
      payload.roomCode,
      activeDiscount,
    );

    if (!updatedRoom || !updatedRoom.activeDiscount) {
      return { ok: false, error: { ...DEFAULT_ROOM_NOT_FOUND_ERROR, roomCode: payload.roomCode } };
    }

    return {
      ok: true,
      room: updatedRoom,
      discount: updatedRoom.activeDiscount,
    };
  }

  public stopDiscount(
    socketRoomCode: string | undefined,
    socketRole: ParticipantRole | undefined,
    payload: DiscountStopPayload,
  ): DiscountOperationResponse {
    const accessError = validateDiscountRoomAccess(
      payload.roomCode,
      socketRoomCode,
      socketRole,
    );

    if (accessError) {
      return { ok: false, error: accessError };
    }

    const payloadError = validateStopDiscountPayload(payload);

    if (payloadError) {
      return { ok: false, error: payloadError };
    }

    const updatedRoom = roomManager.clearDiscountState(payload.roomCode);

    if (!updatedRoom) {
      return { ok: false, error: { ...DEFAULT_ROOM_NOT_FOUND_ERROR, roomCode: payload.roomCode } };
    }

    return {
      ok: true,
      room: updatedRoom,
    };
  }
}

export const discountService = new DiscountService();