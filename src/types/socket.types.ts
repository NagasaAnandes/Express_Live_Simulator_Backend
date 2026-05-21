// Shared socket and room types define the realtime contract without introducing business logic.

import { CLIENT_EVENTS, SERVER_EVENTS } from "../socket/events/events";
import type { ErrorPayload, ApiResponse } from "./error.types";

export enum ParticipantRole {
  RECORDER = "RECORDER",
  OPERATOR = "OPERATOR",
  COMMENTER = "COMMENTER",
}

export type OverlayMode = "idle" | "product" | "discount" | "comment";

export interface ActiveProductOverlay {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl?: string | null;
}

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
  activeProduct?: ActiveProductOverlay;
  activeDiscount: ActiveDiscountState | null;
  currentOverlayState: CurrentOverlayState;
  lastActivityAt: Date;
}

export interface JoinRoomPayload {
  roomCode: string;
  role: ParticipantRole;
}

export interface RoomSnapshot {
  roomCode: string;
  participants: {
    recorder: boolean;
    operator: boolean;
    commenter: boolean;
  };
  lastActivityAt?: Date;
}

export interface RoomErrorPayload {
  code: string;
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
  product: ActiveProductOverlay;
}

export interface ProductErrorPayload {
  code: string;
  message: string;
  roomCode?: string;
  productId?: string;
}

export interface SocketServerState {
  roomCode?: string;
  role?: ParticipantRole;
}

export interface ServerToClientEvents {
  [SERVER_EVENTS.ROOM_CREATED]: (payload: ApiResponse<RoomSnapshot>) => void;
  [SERVER_EVENTS.ROOM_JOINED]: (payload: ApiResponse<RoomSnapshot>) => void;
  [SERVER_EVENTS.ROOM_UPDATED]: (payload: ApiResponse<RoomState>) => void;
  [SERVER_EVENTS.ROOM_ERROR]: (payload: ApiResponse<null>) => void;
  [SERVER_EVENTS.PRODUCT_UPDATED]: (
    payload: ApiResponse<ProductOverlayPayload>,
  ) => void;
  [SERVER_EVENTS.PRODUCT_CLEARED]: (
    payload: ApiResponse<ProductClearPayload>,
  ) => void;
  [SERVER_EVENTS.PRODUCT_ERROR]: (payload: ApiResponse<null>) => void;
}

export interface ClientToServerEvents {
  [CLIENT_EVENTS.CREATE_ROOM]: () => void;
  [CLIENT_EVENTS.JOIN_ROOM]: (payload: JoinRoomPayload) => void;
  [CLIENT_EVENTS.LEAVE_ROOM]: () => void;
  [CLIENT_EVENTS.SHOW_PRODUCT]: (payload: ProductShowPayload) => void;
  [CLIENT_EVENTS.CLEAR_PRODUCT]: (payload: ProductClearPayload) => void;
}

export interface InterServerEvents {
  // Reserved for multi-node coordination in a later scaling phase.
}
