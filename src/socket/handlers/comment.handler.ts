import type { Server, Socket } from "socket.io";

import { CLIENT_EVENTS } from "../events/events";
import { commentService } from "../../modules/comment/comment.service";
import {
  type ClientToServerEvents,
  type CommentTriggerPayload,
  ParticipantRole,
  type InterServerEvents,
  type RoomState,
  type ServerToClientEvents,
  type SocketServerState,
} from "../../types/socket.types";
import {
  emitCommentError,
  emitCommentQueueUpdated,
  emitCommentQueueUpdatedToSocket,
  emitCommentReceived,
} from "../gateway/comment.gateway";
import { roomManager } from "../rooms/room.manager";

type RealtimeSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
>;

type RealtimeServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketServerState
>;

export function syncRecorderCommentQueue(
  socket: RealtimeSocket,
  roomState: RoomState,
): void {
  if (socket.data.role !== ParticipantRole.RECORDER) {
    return;
  }

  const activeComments = roomManager.getActiveComments(roomState.roomCode);

  if (!activeComments) {
    return;
  }

  emitCommentQueueUpdatedToSocket(socket, {
    roomCode: roomState.roomCode,
    activeComments,
  });
}

export function registerCommentHandler(io: RealtimeServer): void {
  io.on("connection", (socket) => {
    socket.on(
      CLIENT_EVENTS.TRIGGER_COMMENT,
      async (payload: CommentTriggerPayload) => {
        const result = await commentService.triggerComment(
          socket.data.roomCode,
          socket.data.role,
          payload,
        );

        if (!result.ok) {
          emitCommentError(socket, result.error);
          return;
        }

        emitCommentReceived(io, result.room.roomCode, {
          roomCode: result.room.roomCode,
          comment: result.comment,
        });

        emitCommentQueueUpdated(io, result.room.roomCode, {
          roomCode: result.room.roomCode,
          activeComments: result.queue,
        });
      },
    );
  });
}
