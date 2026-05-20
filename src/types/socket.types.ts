// Shared socket and room types define the realtime contract without introducing business logic.

export type ParticipantRole = "recorder" | "operator" | "commenter";

export interface RoomParticipant {
  participantId: string;
  socketId: string;
  role: ParticipantRole;
  joinedAt: Date;
}

export interface ActiveProductState {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface ActiveDiscountState {
  discountId: string;
  label: string;
  percentage: number;
}

export interface OverlayState {
  overlayType: "idle" | "product" | "discount" | "comment";
  title?: string;
  subtitle?: string;
  visible: boolean;
}

export interface RoomState {
  roomCode: string;
  participants: RoomParticipant[];
  activeProduct: ActiveProductState | null;
  activeDiscount: ActiveDiscountState | null;
  currentOverlay: OverlayState;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomPayload {
  roomCode: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  participantId: string;
  role: ParticipantRole;
}

export interface ShowProductPayload {
  roomCode: string;
}

export interface StartDiscountPayload {
  roomCode: string;
}

export interface ShowCommentPayload {
  roomCode: string;
}

export interface SocketServerState {
  roomCode?: string;
  participantId?: string;
  role?: ParticipantRole;
}

export interface ServerToClientEvents {
  // TODO: define concrete outbound realtime events when the event contract is finalized.
  ready: (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  // TODO: bind event payloads to the finalized room and presentation workflow.
  noop: () => void;
}

export interface InterServerEvents {
  // TODO: add cross-node socket events when horizontal scaling is introduced.
}
