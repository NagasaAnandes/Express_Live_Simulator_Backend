import type { CommentTemplate } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { CommentErrorCode } from "../../types/error.types";
import { roomManager } from "../../socket/rooms/room.manager";
import type {
  ActiveCommentOverlay,
  CommentErrorPayload,
  CommentTriggerPayload,
  ParticipantRole,
  RoomState,
} from "../../types/socket.types";
import { generateFakeUsername } from "./generators/username.generator";
import { mapCommentTemplateToOverlay } from "./mappers/comment.mapper";
import {
  validateCommentRoomAccess,
  validateCommentTriggerPayload,
} from "./validators/comment.validator";

export interface CommentOperationResult {
  ok: true;
  room: RoomState;
  comment: ActiveCommentOverlay;
  queue: ActiveCommentOverlay[];
}

export interface CommentOperationErrorResult {
  ok: false;
  error: CommentErrorPayload;
}

export type CommentOperationResponse =
  | CommentOperationResult
  | CommentOperationErrorResult;

const DEFAULT_TEMPLATE_NOT_FOUND_ERROR: CommentErrorPayload = {
  code: CommentErrorCode.TEMPLATE_NOT_FOUND,
  message: "No comment templates found for that category.",
};

function pickRandomTemplate(
  templates: readonly CommentTemplate[],
): CommentTemplate {
  const index = Math.floor(Math.random() * templates.length);

  return templates[index];
}

// CommentService orchestrates template lookup and transient queue updates for audience simulation.
export class CommentService {
  public async triggerComment(
    socketRoomCode: string | undefined,
    socketRole: ParticipantRole | undefined,
    payload: CommentTriggerPayload,
  ): Promise<CommentOperationResponse> {
    const accessError = validateCommentRoomAccess(
      payload.roomCode,
      socketRoomCode,
      socketRole,
    );

    if (accessError) {
      return { ok: false, error: accessError };
    }

    const payloadError = validateCommentTriggerPayload(payload);

    if (payloadError) {
      return { ok: false, error: payloadError };
    }

    const templates = await prisma.commentTemplate.findMany({
      where: {
        category: payload.category,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (templates.length === 0) {
      return {
        ok: false,
        error: {
          ...DEFAULT_TEMPLATE_NOT_FOUND_ERROR,
          roomCode: payload.roomCode,
          category: payload.category,
        },
      };
    }

    const template = pickRandomTemplate(templates);
    const username = generateFakeUsername();
    const comment = mapCommentTemplateToOverlay(
      template,
      payload.category,
      username,
    );

    const updatedRoom = roomManager.appendComment(payload.roomCode, comment);

    if (!updatedRoom) {
      return {
        ok: false,
        error: {
          code: CommentErrorCode.ROOM_NOT_FOUND,
          message: "Room not found.",
          roomCode: payload.roomCode,
          category: payload.category,
        },
      };
    }

    return {
      ok: true,
      room: updatedRoom,
      comment,
      queue: updatedRoom.activeComments,
    };
  }
}

export const commentService = new CommentService();
