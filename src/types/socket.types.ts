// Shared socket and room types define the realtime contract without introducing business logic.

import type { Product } from "@prisma/client";

import {
  RoomErrorCode,
  ProductErrorCode,
  SocketClientEvent,
  SocketServerEvent,
} from "../socket/events/events";

export enum ParticipantRole {
  RECORDER = "RECORDER",
  OPERATOR = "OPERATOR",
  COMMENTER = "COMMENTER",
}

export type OverlayMode = "idle" | "product" | "discount" | "comment";

export interface RoomParticipant {
  socketId: string;
  role: ParticipantRole;
}

export interface ActiveDiscountState {
  discountId: string;
  label: string;
  percentage: number;
}

export interface CurrentOverlayState {
  overlayType: OverlayMode;
  visible: boolean;
  title?: string;
  subtitle?: string;
}

export interface RoomState {
  roomCode: string;
  participants: RoomParticipant[];
  createdAt: Date;
  activeProduct?: Product;
  activeDiscount: ActiveDiscountState | null;
  currentOverlayState: CurrentOverlayState;
}

export interface JoinRoomPayload {
  roomCode: string;
  role: ParticipantRole;
}

export interface RoomSnapshot {
  roomCode: string;
  participants: RoomParticipant[];
}

export interface RoomErrorPayload {
  code: RoomErrorCode;
  message: string;
  roomCode?: string;
}

export interface ProductShowPayload {
  roomCode: string;
  productId: string;
}

export interface ProductClearPayload {
  roomCode: string;
}

export interface ProductOverlayPayload {
  roomCode: string;
  product: Product;
}

export interface ProductErrorPayload {
  code: ProductErrorCode;
  message: string;
  roomCode?: string;
  productId?: string;
}

export interface SocketServerState {
  roomCode?: string;
  role?: ParticipantRole;
}

export interface ServerToClientEvents {
  [SocketServerEvent.ROOM_CREATED]: (payload: RoomSnapshot) => void;
  [SocketServerEvent.ROOM_JOINED]: (payload: RoomSnapshot) => void;
  [SocketServerEvent.ROOM_UPDATED]: (payload: RoomState) => void;
  [SocketServerEvent.ROOM_ERROR]: (payload: RoomErrorPayload) => void;
  [SocketServerEvent.PRODUCT_UPDATED]: (payload: ProductOverlayPayload) => void;
  [SocketServerEvent.PRODUCT_CLEARED]: (payload: ProductClearPayload) => void;
  [SocketServerEvent.PRODUCT_ERROR]: (payload: ProductErrorPayload) => void;
}

export interface ClientToServerEvents {
  [SocketClientEvent.CREATE_ROOM]: () => void;
  [SocketClientEvent.JOIN_ROOM]: (payload: JoinRoomPayload) => void;
  [SocketClientEvent.LEAVE_ROOM]: () => void;
  [SocketClientEvent.SHOW_PRODUCT]: (payload: ProductShowPayload) => void;
  [SocketClientEvent.CLEAR_PRODUCT]: (payload: ProductClearPayload) => void;
}

export interface InterServerEvents {
  // Reserved for multi-node coordination in a later scaling phase.
}
