import type { Product } from "@prisma/client";
import type { Server, Socket } from "socket.io";

import { productService } from "../../modules/product/product.service";
import { mapProductToOverlay } from "../../utils/product.mapper";
import {
  ParticipantRole,
  type ClientToServerEvents,
  type InterServerEvents,
  type ProductClearPayload,
  type ProductErrorPayload,
  type ProductShowPayload,
  type ProductOverlayPayload,
  type ServerToClientEvents,
  type SocketServerState,
  type RoomState,
} from "../../types/socket.types";
import { CLIENT_EVENTS } from "../events/events";
import { ProductErrorCode } from "../../types/error.types";
import { roomManager } from "../rooms/room.manager";
import {
  emitProductUpdated,
  emitProductCleared,
  emitProductError,
  emitProductUpdatedToSocket,
  emitRoomUpdated,
} from "../gateway/socket.gateway";

const PRODUCT_ERROR_MESSAGES: Record<ProductErrorCode, string> = {
  [ProductErrorCode.ROOM_NOT_FOUND]: "Room not found.",
  [ProductErrorCode.ROOM_MISMATCH]: "Socket is not attached to that room.",
  [ProductErrorCode.INVALID_ROLE]:
    "Only the operator can manage the product overlay.",
  [ProductErrorCode.PRODUCT_NOT_FOUND]: "Product not found.",
};

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

function createProductError(
  code: ProductErrorCode,
  roomCode?: string,
  productId?: string,
): ProductErrorPayload {
  return {
    code,
    message: PRODUCT_ERROR_MESSAGES[code],
    roomCode,
    productId,
  };
}

function assertProductOverlayAccess(
  socket: RealtimeSocket,
  payload: ProductShowPayload | ProductClearPayload,
): ProductErrorCode | null {
  const attachedRoomCode = socket.data.roomCode;

  if (!attachedRoomCode || attachedRoomCode !== payload.roomCode) {
    return ProductErrorCode.ROOM_MISMATCH;
  }

  const room = roomManager.getRoom(payload.roomCode);

  if (!room) {
    return ProductErrorCode.ROOM_NOT_FOUND;
  }

  if (socket.data.role !== ParticipantRole.OPERATOR) {
    return ProductErrorCode.INVALID_ROLE;
  }

  return null;
}

export function syncRecorderProductOverlay(
  socket: RealtimeSocket,
  roomState: RoomState,
): void {
  if (
    socket.data.role !== ParticipantRole.RECORDER ||
    !roomState.activeProduct
  ) {
    return;
  }

  emitProductUpdatedToSocket(socket, {
    roomCode: roomState.roomCode,
    product: roomState.activeProduct,
  });
}

export function registerProductHandler(io: RealtimeServer): void {
  io.on("connection", (socket) => {
    socket.on(
      CLIENT_EVENTS.SHOW_PRODUCT,
      async (payload: ProductShowPayload) => {
        const accessError = assertProductOverlayAccess(socket, payload);

        if (accessError) {
          emitProductError(
            socket,
            createProductError(
              accessError,
              payload.roomCode,
              payload.productId,
            ),
          );
          return;
        }

        const product = await productService.getProductById(payload.productId);

        if (!product) {
          emitProductError(
            socket,
            createProductError(
              ProductErrorCode.PRODUCT_NOT_FOUND,
              payload.roomCode,
              payload.productId,
            ),
          );
          return;
        }

        const overlay = mapProductToOverlay(product);

        const updatedRoom = roomManager.setActiveProduct(
          payload.roomCode,
          overlay,
        );

        if (!updatedRoom || !updatedRoom.activeProduct) {
          emitProductError(
            socket,
            createProductError(
              ProductErrorCode.ROOM_NOT_FOUND,
              payload.roomCode,
              payload.productId,
            ),
          );
          return;
        }

        emitProductUpdated(io, payload.roomCode, {
          roomCode: payload.roomCode,
          product: updatedRoom.activeProduct,
        });

        emitRoomUpdated(io, payload.roomCode, updatedRoom);
      },
    );

    socket.on(CLIENT_EVENTS.CLEAR_PRODUCT, (payload: ProductClearPayload) => {
      const accessError = assertProductOverlayAccess(socket, payload);

      if (accessError) {
        emitProductError(
          socket,
          createProductError(accessError, payload.roomCode),
        );
        return;
      }

      const updatedRoom = roomManager.clearActiveProduct(payload.roomCode);

      if (!updatedRoom) {
        emitProductError(
          socket,
          createProductError(ProductErrorCode.ROOM_NOT_FOUND, payload.roomCode),
        );
        return;
      }

      emitProductCleared(io, payload.roomCode, { roomCode: payload.roomCode });

      emitRoomUpdated(io, payload.roomCode, updatedRoom);
    });
  });
}
