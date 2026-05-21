"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomManager = exports.RoomManager = void 0;
const socket_types_1 = require("../../types/socket.types");
const room_store_1 = require("../state/room.store");
const room_snapshot_mapper_1 = require("../../modules/room/mappers/room.snapshot.mapper");
// RoomManager owns all in-memory room lifecycle access so socket handlers stay thin.
class RoomManager {
    getRoom(roomCode) {
        return room_store_1.roomStore.get(roomCode);
    }
    getRoomBySocketId(socketId) {
        return this.listRooms().find((room) => room.participants.some((participant) => participant.socketId === socketId));
    }
    saveRoom(roomState) {
        room_store_1.roomStore.set(roomState.roomCode, roomState);
    }
    deleteRoom(roomCode) {
        return room_store_1.roomStore.delete(roomCode);
    }
    listRooms() {
        return Array.from(room_store_1.roomStore.values());
    }
    createRoom(socketId) {
        const roomCode = this.generateUniqueRoomCode();
        const roomState = this.createEmptyRoomState(roomCode, socketId);
        this.saveRoom(roomState);
        return this.cloneRoomState(roomState);
    }
    joinParticipant(roomCode, participant) {
        const room = room_store_1.roomStore.get(roomCode);
        if (!room) {
            return null;
        }
        const nextRoom = this.cloneRoomState(room);
        nextRoom.participants = [...nextRoom.participants, { ...participant }];
        nextRoom.lastActivityAt = new Date();
        this.saveRoom(nextRoom);
        return this.cloneRoomState(nextRoom);
    }
    removeParticipant(socketId) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) {
            return null;
        }
        const nextParticipants = room.participants.filter((participant) => participant.socketId !== socketId);
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
    setActiveProduct(roomCode, activeProduct) {
        const room = room_store_1.roomStore.get(roomCode);
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
    clearActiveProduct(roomCode) {
        const room = room_store_1.roomStore.get(roomCode);
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
    setDiscountState(roomCode, activeDiscount) {
        const room = room_store_1.roomStore.get(roomCode);
        if (!room) {
            return null;
        }
        const nextRoom = this.cloneRoomState(room);
        nextRoom.activeDiscount = { ...activeDiscount };
        nextRoom.lastActivityAt = new Date();
        this.saveRoom(nextRoom);
        return this.cloneRoomState(nextRoom);
    }
    clearDiscountState(roomCode) {
        const room = room_store_1.roomStore.get(roomCode);
        if (!room) {
            return null;
        }
        const nextRoom = this.cloneRoomState(room);
        delete nextRoom.activeDiscount;
        nextRoom.lastActivityAt = new Date();
        this.saveRoom(nextRoom);
        return this.cloneRoomState(nextRoom);
    }
    toSnapshot(roomState) {
        return (0, room_snapshot_mapper_1.toRoomSnapshot)(roomState);
    }
    createEmptyRoomState(roomCode, socketId) {
        return {
            roomCode,
            participants: [
                {
                    socketId,
                    role: socket_types_1.ParticipantRole.RECORDER,
                },
            ],
            createdAt: new Date(),
            currentOverlayState: this.createInitialOverlayState(),
            lastActivityAt: new Date(),
        };
    }
    createInitialOverlayState() {
        return {
            overlayType: "idle",
            visible: false,
        };
    }
    cloneRoomState(roomState) {
        const clonedRoomState = {
            roomCode: roomState.roomCode,
            participants: roomState.participants.map((participant) => ({
                ...participant,
            })),
            createdAt: new Date(roomState.createdAt),
            currentOverlayState: { ...roomState.currentOverlayState },
            lastActivityAt: roomState.lastActivityAt
                ? new Date(roomState.lastActivityAt)
                : new Date(),
        };
        if (roomState.activeProduct) {
            clonedRoomState.activeProduct = { ...roomState.activeProduct };
        }
        if (roomState.activeDiscount) {
            clonedRoomState.activeDiscount = { ...roomState.activeDiscount };
        }
        clonedRoomState.lastActivityAt = roomState.lastActivityAt
            ? new Date(roomState.lastActivityAt)
            : new Date();
        return clonedRoomState;
    }
    generateUniqueRoomCode() {
        let roomCode = "";
        do {
            roomCode = String(Math.floor(1000 + Math.random() * 9000));
        } while (room_store_1.roomStore.has(roomCode));
        return roomCode;
    }
}
exports.RoomManager = RoomManager;
exports.roomManager = new RoomManager();
