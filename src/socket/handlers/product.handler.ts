import type { Product } from "@prisma/client";
import type { Server, Socket } from "socket.io";

import { productService } from "../../modules/product/product.service";
import {
  ParticipantRole,
  type ClientToServerEvents,
  type InterServerEvents,
  type ProductClearPayload,
  type ProductErrorPayload,
  type ProductShowPayload,
  type ServerToClientEvents,
  type SocketServerState,
} from "../../types/socket.types";
import {
  ProductErrorCode,
  SocketClientEvent,
  SocketServerEvent,
} from "../events/events";
import { roomManager } from "../rooms/room.manager";

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

function emitProductError(
  socket: RealtimeSocket,
  code: ProductErrorCode,
  roomCode?: string,
  productId?: string,
): void {
  socket.emit(
    SocketServerEvent.PRODUCT_ERROR,
    createProductError(code, roomCode, productId),
  );
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

function emitRoomOverlayState(io: RealtimeServer, roomCode: string): void {
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    return;
  }

  io.to(roomCode).emit(SocketServerEvent.ROOM_UPDATED, room);
}

export function syncRecorderProductOverlay(
  socket: RealtimeSocket,
  roomState: {
    roomCode: string;
    activeProduct?: Product;
  },
): void {
  if (
    socket.data.role !== ParticipantRole.RECORDER ||
    !roomState.activeProduct
  ) {
    return;
  }

  socket.emit(SocketServerEvent.PRODUCT_UPDATED, {
    roomCode: roomState.roomCode,
    product: roomState.activeProduct,
  });
}

export function registerProductHandler(io: RealtimeServer): void {
  io.on("connection", (socket) => {
    socket.on(SocketClientEvent.SHOW_PRODUCT, async (payload) => {
      const accessError = assertProductOverlayAccess(socket, payload);

      if (accessError) {
        emitProductError(
          socket,
          accessError,
          payload.roomCode,
          payload.productId,
        );
        return;
      }

      const product = await productService.getProductById(payload.productId);

      if (!product) {
        emitProductError(
          socket,
          ProductErrorCode.PRODUCT_NOT_FOUND,
          payload.roomCode,
          payload.productId,
        );
        return;
      }

      const updatedRoom = roomManager.setActiveProduct(
        payload.roomCode,
        product,
      );

      if (!updatedRoom || !updatedRoom.activeProduct) {
        emitProductError(
          socket,
          ProductErrorCode.ROOM_NOT_FOUND,
          payload.roomCode,
          payload.productId,
        );
        return;
      }

      io.to(payload.roomCode).emit(SocketServerEvent.PRODUCT_UPDATED, {
        roomCode: payload.roomCode,
        product: updatedRoom.activeProduct,
      });

      emitRoomOverlayState(io, payload.roomCode);
    });

    socket.on(SocketClientEvent.CLEAR_PRODUCT, (payload) => {
      const accessError = assertProductOverlayAccess(socket, payload);

      if (accessError) {
        emitProductError(socket, accessError, payload.roomCode);
        return;
      }

      const updatedRoom = roomManager.clearActiveProduct(payload.roomCode);

      if (!updatedRoom) {
        emitProductError(
          socket,
          ProductErrorCode.ROOM_NOT_FOUND,
          payload.roomCode,
        );
        return;
      }

      io.to(payload.roomCode).emit(SocketServerEvent.PRODUCT_CLEARED, {
        roomCode: payload.roomCode,
      });

      emitRoomOverlayState(io, payload.roomCode);
    });
  });
}
