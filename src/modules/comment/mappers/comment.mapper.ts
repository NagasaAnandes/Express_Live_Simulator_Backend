import { randomUUID } from "crypto";

import type { CommentTemplate } from "@prisma/client";

import {
  type ActiveCommentOverlay,
  type CommentCategory,
} from "../../../types/socket.types";

export function mapCommentTemplateToOverlay(
  template: CommentTemplate,
  category: CommentCategory,
  username: string,
): ActiveCommentOverlay {
  return {
    id: randomUUID(),
    category,
    username,
    message: template.message,
    createdAt: new Date(),
  };
}

export function cloneActiveCommentOverlay(
  comment: ActiveCommentOverlay,
): ActiveCommentOverlay {
  return {
    id: comment.id,
    category: comment.category,
    username: comment.username,
    message: comment.message,
    createdAt: new Date(comment.createdAt),
  };
}
