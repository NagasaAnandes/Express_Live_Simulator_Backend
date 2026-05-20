import {
  ParticipantRole,
  type CurrentOverlayState,
  type RoomErrorPayload,
  type RoomParticipant,
  type RoomSnapshot,
  type RoomState,
} from "../../types/socket.types";
import type { Product } from "@prisma/client";
import { RoomErrorCode } from "../events/events";
import { roomStore } from "../state/room.store";

const ROOM_ERROR_MESSAGES: Record<RoomErrorCode, string> = {
  [RoomErrorCode.ROOM_NOT_FOUND]: "Room not found.",
  [RoomErrorCode.ROOM_FULL]:
    "Room already has the maximum number of participants.",
  [RoomErrorCode.ROLE_ALREADY_USED]: "That role is already taken in the room.",
  [RoomErrorCode.INVALID_ROLE]: "Invalid room role.",
};

export interface RoomJoinResult {
  ok: true;
  room: RoomState;
}

export interface RoomJoinErrorResult {
  ok: false;
  error: RoomErrorPayload;
}

export type RoomJoinResponse = RoomJoinResult | RoomJoinErrorResult;

export interface RoomLeaveResult {
  roomCode: string;
  room: RoomState | null;
  deleted: boolean;
}

// RoomManager owns all in-memory room lifecycle access so socket handlers stay thin.
export class RoomManager {
  public getRoom(roomCode: string): RoomState | undefined {
    return roomStore.get(roomCode);
  }

  public getRoomBySocketId(socketId: string): RoomState | undefined {
    return this.listRooms().find((room) =>
      room.participants.some(
        (participant) => participant.socketId === socketId,
      ),
    );
  }

  public saveRoom(roomState: RoomState): void {
    roomStore.set(roomState.roomCode, roomState);
  }

  public removeRoom(roomCode: string): boolean {
    return roomStore.delete(roomCode);
  }

  public listRooms(): RoomState[] {
    return Array.from(roomStore.values());
  }

  public createRoom(socketId: string): RoomState {
    const roomCode = this.generateUniqueRoomCode();
    const roomState = this.createEmptyRoomState(roomCode, socketId);

    this.saveRoom(roomState);

    return this.cloneRoomState(roomState);
  }

  public joinRoom(
    roomCode: string,
    socketId: string,
    role: string,
  ): RoomJoinResponse {
    const room = roomStore.get(roomCode);

    if (!room) {
      return this.createJoinError(RoomErrorCode.ROOM_NOT_FOUND, roomCode);
    }

    if (!this.isParticipantRole(role)) {
      return this.createJoinError(RoomErrorCode.INVALID_ROLE, roomCode);
    }

    if (room.participants.some((participant) => participant.role === role)) {
      return this.createJoinError(RoomErrorCode.ROLE_ALREADY_USED, roomCode);
    }

    if (room.participants.length >= 3) {
      return this.createJoinError(RoomErrorCode.ROOM_FULL, roomCode);
    }

    const nextRoom = this.cloneRoomState(room);
    nextRoom.participants = [
      ...nextRoom.participants,
      {
        socketId,
        role,
      },
    ];

    this.saveRoom(nextRoom);

    return {
      ok: true,
      room: this.cloneRoomState(nextRoom),
    };
  }

  public setActiveProduct(
    roomCode: string,
    product: Product,
  ): RoomState | null {
    const room = roomStore.get(roomCode);

    if (!room) {
      return null;
    }

    const nextRoom = this.cloneRoomState(room);

    nextRoom.activeProduct = this.cloneProduct(product);
    nextRoom.currentOverlayState = {
      overlayType: "product",
      visible: true,
      title: product.name,
      subtitle: product.description ?? undefined,
    };

    this.saveRoom(nextRoom);

    return this.cloneRoomState(nextRoom);
  }

  public clearActiveProduct(roomCode: string): RoomState | null {
    const room = roomStore.get(roomCode);

    if (!room) {
      return null;
    }

    const nextRoom = this.cloneRoomState(room);

    delete nextRoom.activeProduct;
    nextRoom.currentOverlayState = this.createInitialOverlayState();

    this.saveRoom(nextRoom);

    return this.cloneRoomState(nextRoom);
  }

  public leaveRoom(socketId: string): RoomLeaveResult | null {
    const room = this.getRoomBySocketId(socketId);

    if (!room) {
      return null;
    }

    const nextParticipants = room.participants.filter(
      (participant) => participant.socketId !== socketId,
    );

    if (nextParticipants.length === 0) {
      this.removeRoom(room.roomCode);

      return {
        roomCode: room.roomCode,
        room: null,
        deleted: true,
      };
    }

    const nextRoom = this.cloneRoomState(room);
    nextRoom.participants = nextParticipants;
    this.saveRoom(nextRoom);

    return {
      roomCode: nextRoom.roomCode,
      room: this.cloneRoomState(nextRoom),
      deleted: false,
    };
  }

  public toSnapshot(roomState: RoomState): RoomSnapshot {
    return {
      roomCode: roomState.roomCode,
      participants: roomState.participants.map((participant) => ({
        ...participant,
      })),
    };
  }

  public isParticipantRole(value: string): value is ParticipantRole {
    return Object.values(ParticipantRole).includes(value as ParticipantRole);
  }

  public createRoomError(
    code: RoomErrorCode,
    roomCode?: string,
  ): RoomErrorPayload {
    return {
      code,
      message: ROOM_ERROR_MESSAGES[code],
      roomCode,
    };
  }

  private createJoinError(
    code: RoomErrorCode,
    roomCode?: string,
  ): RoomJoinErrorResult {
    return {
      ok: false,
      error: this.createRoomError(code, roomCode),
    };
  }

  private createEmptyRoomState(roomCode: string, socketId: string): RoomState {
    return {
      roomCode,
      participants: [
        {
          socketId,
          role: ParticipantRole.RECORDER,
        },
      ],
      createdAt: new Date(),
      activeDiscount: null,
      currentOverlayState: this.createInitialOverlayState(),
    };
  }

  private createInitialOverlayState(): CurrentOverlayState {
    return {
      overlayType: "idle",
      visible: false,
    };
  }

  private cloneRoomState(roomState: RoomState): RoomState {
    const clonedRoomState: RoomState = {
      roomCode: roomState.roomCode,
      participants: roomState.participants.map((participant) => ({
        ...participant,
      })),
      createdAt: new Date(roomState.createdAt),
      activeDiscount: roomState.activeDiscount
        ? { ...roomState.activeDiscount }
        : null,
      currentOverlayState: { ...roomState.currentOverlayState },
    };

    if (roomState.activeProduct) {
      clonedRoomState.activeProduct = this.cloneProduct(
        roomState.activeProduct,
      );
    }

    return clonedRoomState;
  }

  private cloneProduct(product: Product): Product {
    return {
      ...product,
      createdAt: new Date(product.createdAt),
    };
  }

  private generateUniqueRoomCode(): string {
    let roomCode = "";

    do {
      roomCode = String(Math.floor(1000 + Math.random() * 9000));
    } while (roomStore.has(roomCode));

    return roomCode;
  }
}

export const roomManager = new RoomManager();
