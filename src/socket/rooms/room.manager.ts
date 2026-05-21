import {
  type ActiveDiscountState,
  type ActiveProductOverlay,
  ParticipantRole,
  type CurrentOverlayState,
  type RoomParticipant,
  type RoomSnapshot,
  type RoomState,
} from "../../types/socket.types";
import { roomStore } from "../state/room.store";
import { toRoomSnapshot } from "../../modules/room/mappers/room.snapshot.mapper";

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

  public deleteRoom(roomCode: string): boolean {
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

  public joinParticipant(
    roomCode: string,
    participant: RoomParticipant,
  ): RoomState | null {
    const room = roomStore.get(roomCode);

    if (!room) {
      return null;
    }

    const nextRoom = this.cloneRoomState(room);
    nextRoom.participants = [...nextRoom.participants, { ...participant }];
    nextRoom.lastActivityAt = new Date();

    this.saveRoom(nextRoom);

    return this.cloneRoomState(nextRoom);
  }

  public removeParticipant(socketId: string): RoomLeaveResult | null {
    const room = this.getRoomBySocketId(socketId);

    if (!room) {
      return null;
    }

    const nextParticipants = room.participants.filter(
      (participant) => participant.socketId !== socketId,
    );

    if (nextParticipants.length === 0) {
      this.deleteRoom(room.roomCode);

      return {
        roomCode: room.roomCode,
        room: null,
        deleted: true,
      };
    }

    const nextRoom = this.cloneRoomState(room);
    nextRoom.participants = nextParticipants;
    nextRoom.lastActivityAt = new Date();
    this.saveRoom(nextRoom);

    return {
      roomCode: nextRoom.roomCode,
      room: this.cloneRoomState(nextRoom),
      deleted: false,
    };
  }

  public setActiveProduct(
    roomCode: string,
    activeProduct: ActiveProductOverlay,
  ): RoomState | null {
    const room = roomStore.get(roomCode);

    if (!room) {
      return null;
    }

    const nextRoom = this.cloneRoomState(room);

    nextRoom.activeProduct = { ...activeProduct };
    nextRoom.currentOverlayState = {
      overlayType: "product",
      visible: true,
      title: activeProduct.name,
      subtitle: undefined,
    };
    nextRoom.lastActivityAt = new Date();

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
    nextRoom.lastActivityAt = new Date();

    this.saveRoom(nextRoom);

    return this.cloneRoomState(nextRoom);
  }

  public setDiscountState(
    roomCode: string,
    activeDiscount: ActiveDiscountState,
  ): RoomState | null {
    const room = roomStore.get(roomCode);

    if (!room) {
      return null;
    }

    const nextRoom = this.cloneRoomState(room);
    nextRoom.activeDiscount = { ...activeDiscount };
    nextRoom.lastActivityAt = new Date();

    this.saveRoom(nextRoom);

    return this.cloneRoomState(nextRoom);
  }

  public clearDiscountState(roomCode: string): RoomState | null {
    const room = roomStore.get(roomCode);

    if (!room) {
      return null;
    }

    const nextRoom = this.cloneRoomState(room);
    nextRoom.activeDiscount = null;
    nextRoom.lastActivityAt = new Date();

    this.saveRoom(nextRoom);

    return this.cloneRoomState(nextRoom);
  }

  public toSnapshot(roomState: RoomState): RoomSnapshot {
    return toRoomSnapshot(roomState);
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
      lastActivityAt: new Date(),
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
      lastActivityAt: roomState.lastActivityAt
        ? new Date(roomState.lastActivityAt)
        : new Date(),
    };

    if (roomState.activeProduct) {
      clonedRoomState.activeProduct = { ...roomState.activeProduct };
    }

    clonedRoomState.lastActivityAt = roomState.lastActivityAt
      ? new Date(roomState.lastActivityAt)
      : new Date();

    return clonedRoomState;
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
