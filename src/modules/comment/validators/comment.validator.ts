import { CommentErrorCode } from "../../../types/error.types";
import {
  CommentCategory,
  ParticipantRole,
  type CommentErrorPayload,
  type CommentTriggerPayload,
} from "../../../types/socket.types";
import { roomManager } from "../../../socket/rooms/room.manager";

const COMMENT_ERROR_MESSAGES: Record<CommentErrorCode, string> = {
  [CommentErrorCode.ROOM_NOT_FOUND]: "Room not found.",
  [CommentErrorCode.ROOM_MISMATCH]: "Socket is not attached to that room.",
  [CommentErrorCode.INVALID_ROLE]:
    "Only the commenter can trigger audience comments.",
  [CommentErrorCode.INVALID_CATEGORY]: "Invalid comment category.",
  [CommentErrorCode.TEMPLATE_NOT_FOUND]:
    "No comment templates found for that category.",
};

function createCommentError(
  code: CommentErrorCode,
  roomCode?: string,
  category?: CommentCategory,
): CommentErrorPayload {
  return {
    code,
    message: COMMENT_ERROR_MESSAGES[code],
    roomCode,
    category,
  };
}

export function validateCommentRoomAccess(
  roomCode: string,
  socketRoomCode: string | undefined,
  role: ParticipantRole | undefined,
): CommentErrorPayload | null {
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    return createCommentError(CommentErrorCode.ROOM_NOT_FOUND, roomCode);
  }

  if (!socketRoomCode || socketRoomCode !== roomCode) {
    return createCommentError(CommentErrorCode.ROOM_MISMATCH, roomCode);
  }

  if (role !== ParticipantRole.COMMENTER) {
    return createCommentError(CommentErrorCode.INVALID_ROLE, roomCode);
  }

  return null;
}

export function validateCommentTriggerPayload(
  payload: CommentTriggerPayload,
): CommentErrorPayload | null {
  if (
    !Object.values(CommentCategory).includes(
      payload.category as CommentCategory,
    )
  ) {
    return createCommentError(
      CommentErrorCode.INVALID_CATEGORY,
      payload.roomCode,
      payload.category,
    );
  }

  return null;
}
