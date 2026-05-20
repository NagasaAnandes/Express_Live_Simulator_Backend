"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRecorderProductOverlay = syncRecorderProductOverlay;
exports.registerProductHandler = registerProductHandler;
const product_service_1 = require("../../modules/product/product.service");
const socket_types_1 = require("../../types/socket.types");
const events_1 = require("../events/events");
const room_manager_1 = require("../rooms/room.manager");
const PRODUCT_ERROR_MESSAGES = {
    [events_1.ProductErrorCode.ROOM_NOT_FOUND]: "Room not found.",
    [events_1.ProductErrorCode.ROOM_MISMATCH]: "Socket is not attached to that room.",
    [events_1.ProductErrorCode.INVALID_ROLE]: "Only the operator can manage the product overlay.",
    [events_1.ProductErrorCode.PRODUCT_NOT_FOUND]: "Product not found.",
};
function createProductError(code, roomCode, productId) {
    return {
        code,
        message: PRODUCT_ERROR_MESSAGES[code],
        roomCode,
        productId,
    };
}
function emitProductError(socket, code, roomCode, productId) {
    socket.emit(events_1.SocketServerEvent.PRODUCT_ERROR, createProductError(code, roomCode, productId));
}
function assertProductOverlayAccess(socket, payload) {
    const attachedRoomCode = socket.data.roomCode;
    if (!attachedRoomCode || attachedRoomCode !== payload.roomCode) {
        return events_1.ProductErrorCode.ROOM_MISMATCH;
    }
    const room = room_manager_1.roomManager.getRoom(payload.roomCode);
    if (!room) {
        return events_1.ProductErrorCode.ROOM_NOT_FOUND;
    }
    if (socket.data.role !== socket_types_1.ParticipantRole.OPERATOR) {
        return events_1.ProductErrorCode.INVALID_ROLE;
    }
    return null;
}
function emitRoomOverlayState(io, roomCode) {
    const room = room_manager_1.roomManager.getRoom(roomCode);
    if (!room) {
        return;
    }
    io.to(roomCode).emit(events_1.SocketServerEvent.ROOM_UPDATED, room);
}
function syncRecorderProductOverlay(socket, roomState) {
    if (socket.data.role !== socket_types_1.ParticipantRole.RECORDER ||
        !roomState.activeProduct) {
        return;
    }
    socket.emit(events_1.SocketServerEvent.PRODUCT_UPDATED, {
        roomCode: roomState.roomCode,
        product: roomState.activeProduct,
    });
}
function registerProductHandler(io) {
    io.on("connection", (socket) => {
        socket.on(events_1.SocketClientEvent.SHOW_PRODUCT, async (payload) => {
            const accessError = assertProductOverlayAccess(socket, payload);
            if (accessError) {
                emitProductError(socket, accessError, payload.roomCode, payload.productId);
                return;
            }
            const product = await product_service_1.productService.getProductById(payload.productId);
            if (!product) {
                emitProductError(socket, events_1.ProductErrorCode.PRODUCT_NOT_FOUND, payload.roomCode, payload.productId);
                return;
            }
            const updatedRoom = room_manager_1.roomManager.setActiveProduct(payload.roomCode, product);
            if (!updatedRoom || !updatedRoom.activeProduct) {
                emitProductError(socket, events_1.ProductErrorCode.ROOM_NOT_FOUND, payload.roomCode, payload.productId);
                return;
            }
            io.to(payload.roomCode).emit(events_1.SocketServerEvent.PRODUCT_UPDATED, {
                roomCode: payload.roomCode,
                product: updatedRoom.activeProduct,
            });
            emitRoomOverlayState(io, payload.roomCode);
        });
        socket.on(events_1.SocketClientEvent.CLEAR_PRODUCT, (payload) => {
            const accessError = assertProductOverlayAccess(socket, payload);
            if (accessError) {
                emitProductError(socket, accessError, payload.roomCode);
                return;
            }
            const updatedRoom = room_manager_1.roomManager.clearActiveProduct(payload.roomCode);
            if (!updatedRoom) {
                emitProductError(socket, events_1.ProductErrorCode.ROOM_NOT_FOUND, payload.roomCode);
                return;
            }
            io.to(payload.roomCode).emit(events_1.SocketServerEvent.PRODUCT_CLEARED, {
                roomCode: payload.roomCode,
            });
            emitRoomOverlayState(io, payload.roomCode);
        });
    });
}
