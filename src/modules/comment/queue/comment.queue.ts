import type { ActiveCommentOverlay } from "../../../types/socket.types";

export const MAX_ACTIVE_COMMENTS = 5;
export const COMMENT_TTL_MS = 30_000;

function isExpiredComment(comment: ActiveCommentOverlay, now: number): boolean {
  return now - comment.createdAt.getTime() >= COMMENT_TTL_MS;
}

export function clearExpiredComments(
  comments: ReadonlyArray<ActiveCommentOverlay>,
  now = Date.now(),
): ActiveCommentOverlay[] {
  return comments.filter((comment) => !isExpiredComment(comment, now));
}

export function trimOldComments(
  comments: ReadonlyArray<ActiveCommentOverlay>,
  maxComments = MAX_ACTIVE_COMMENTS,
): ActiveCommentOverlay[] {
  if (comments.length <= maxComments) {
    return [...comments];
  }

  return comments.slice(comments.length - maxComments);
}

export function appendComment(
  comments: ReadonlyArray<ActiveCommentOverlay>,
  comment: ActiveCommentOverlay,
  now = Date.now(),
): ActiveCommentOverlay[] {
  const activeComments = clearExpiredComments(comments, now);

  return trimOldComments([...activeComments, comment]);
}
