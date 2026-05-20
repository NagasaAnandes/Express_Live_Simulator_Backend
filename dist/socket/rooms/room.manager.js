"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomManager = exports.RoomManager = void 0;
const socket_types_1 = require("../../types/socket.types");
const events_1 = require("../events/events");
const room_store_1 = require("../state/room.store");
const ROOM_ERROR_MESSAGES = {
    [events_1.RoomErrorCode.ROOM_NOT_FOUND]: "Room not found.",
    [events_1.RoomErrorCode.ROOM_FULL]: "Room already has the maximum number of participants.",
    [events_1.RoomErrorCode.ROLE_ALREADY_USED]: "That role is already taken in the room.",
    [events_1.RoomErrorCode.INVALID_ROLE]: "Invalid room role.",
};
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
    removeRoom(roomCode) {
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
    joinRoom(roomCode, socketId, role) {
        const room = room_store_1.roomStore.get(roomCode);
        if (!room) {
            return this.createJoinError(events_1.RoomErrorCode.ROOM_NOT_FOUND, roomCode);
        }
        if (!this.isParticipantRole(role)) {
            return this.createJoinError(events_1.RoomErrorCode.INVALID_ROLE, roomCode);
        }
        if (room.participants.some((participant) => participant.role === role)) {
            return this.createJoinError(events_1.RoomErrorCode.ROLE_ALREADY_USED, roomCode);
        }
        if (room.participants.length >= 3) {
            return this.createJoinError(events_1.RoomErrorCode.ROOM_FULL, roomCode);
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
    leaveRoom(socketId) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) {
            return null;
        }
        const nextParticipants = room.participants.filter((participant) => participant.socketId !== socketId);
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
    toSnapshot(roomState) {
        return {
            roomCode: roomState.roomCode,
            participants: roomState.participants.map((participant) => ({
                ...participant,
            })),
        };
    }
    isParticipantRole(value) {
        return Object.values(socket_types_1.ParticipantRole).includes(value);
    }
    createRoomError(code, roomCode) {
        return {
            code,
            message: ROOM_ERROR_MESSAGES[code],
            roomCode,
        };
    }
    createJoinError(code, roomCode) {
        return {
            ok: false,
            error: this.createRoomError(code, roomCode),
        };
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
            activeProduct: null,
            activeDiscount: null,
            currentOverlayState: this.createInitialOverlayState(),
        };
    }
    createInitialOverlayState() {
        return {
            overlayType: "idle",
            visible: false,
        };
    }
    cloneRoomState(roomState) {
        return {
            roomCode: roomState.roomCode,
            participants: roomState.participants.map((participant) => ({
                ...participant,
            })),
            createdAt: new Date(roomState.createdAt),
            activeProduct: roomState.activeProduct
                ? { ...roomState.activeProduct }
                : null,
            activeDiscount: roomState.activeDiscount
                ? { ...roomState.activeDiscount }
                : null,
            currentOverlayState: { ...roomState.currentOverlayState },
        };
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
