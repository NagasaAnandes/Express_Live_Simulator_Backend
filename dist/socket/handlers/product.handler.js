"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRecorderProductOverlay = syncRecorderProductOverlay;
exports.registerProductHandler = registerProductHandler;
const product_service_1 = require("../../modules/product/product.service");
const product_mapper_1 = require("../../utils/product.mapper");
const socket_types_1 = require("../../types/socket.types");
const events_1 = require("../events/events");
const error_types_1 = require("../../types/error.types");
const room_manager_1 = require("../rooms/room.manager");
const socket_gateway_1 = require("../gateway/socket.gateway");
const PRODUCT_ERROR_MESSAGES = {
    [error_types_1.ProductErrorCode.ROOM_NOT_FOUND]: "Room not found.",
    [error_types_1.ProductErrorCode.ROOM_MISMATCH]: "Socket is not attached to that room.",
    [error_types_1.ProductErrorCode.INVALID_ROLE]: "Only the operator can manage the product overlay.",
    [error_types_1.ProductErrorCode.PRODUCT_NOT_FOUND]: "Product not found.",
};
function createProductError(code, roomCode, productId) {
    return {
        code,
        message: PRODUCT_ERROR_MESSAGES[code],
        roomCode,
        productId,
    };
}
function assertProductOverlayAccess(socket, payload) {
    const attachedRoomCode = socket.data.roomCode;
    if (!attachedRoomCode || attachedRoomCode !== payload.roomCode) {
        return error_types_1.ProductErrorCode.ROOM_MISMATCH;
    }
    const room = room_manager_1.roomManager.getRoom(payload.roomCode);
    if (!room) {
        return error_types_1.ProductErrorCode.ROOM_NOT_FOUND;
    }
    if (socket.data.role !== socket_types_1.ParticipantRole.OPERATOR) {
        return error_types_1.ProductErrorCode.INVALID_ROLE;
    }
    return null;
}
function syncRecorderProductOverlay(socket, roomState) {
    if (socket.data.role !== socket_types_1.ParticipantRole.RECORDER ||
        !roomState.activeProduct) {
        return;
    }
    (0, socket_gateway_1.emitProductUpdatedToSocket)(socket, {
        roomCode: roomState.roomCode,
        product: roomState.activeProduct,
    });
}
function registerProductHandler(io) {
    io.on("connection", (socket) => {
        socket.on(events_1.CLIENT_EVENTS.SHOW_PRODUCT, async (payload) => {
            const accessError = assertProductOverlayAccess(socket, payload);
            if (accessError) {
                (0, socket_gateway_1.emitProductError)(socket, createProductError(accessError, payload.roomCode, payload.productId));
                return;
            }
            const product = await product_service_1.productService.getProductById(payload.productId);
            if (!product) {
                (0, socket_gateway_1.emitProductError)(socket, createProductError(error_types_1.ProductErrorCode.PRODUCT_NOT_FOUND, payload.roomCode, payload.productId));
                return;
            }
            const overlay = (0, product_mapper_1.mapProductToOverlay)(product);
            const updatedRoom = room_manager_1.roomManager.setActiveProduct(payload.roomCode, overlay);
            if (!updatedRoom || !updatedRoom.activeProduct) {
                (0, socket_gateway_1.emitProductError)(socket, createProductError(error_types_1.ProductErrorCode.ROOM_NOT_FOUND, payload.roomCode, payload.productId));
                return;
            }
            (0, socket_gateway_1.emitProductUpdated)(io, payload.roomCode, {
                roomCode: payload.roomCode,
                product: updatedRoom.activeProduct,
            });
            (0, socket_gateway_1.emitRoomUpdated)(io, payload.roomCode, updatedRoom);
        });
        socket.on(events_1.CLIENT_EVENTS.CLEAR_PRODUCT, (payload) => {
            const accessError = assertProductOverlayAccess(socket, payload);
            if (accessError) {
                (0, socket_gateway_1.emitProductError)(socket, createProductError(accessError, payload.roomCode));
                return;
            }
            const updatedRoom = room_manager_1.roomManager.clearActiveProduct(payload.roomCode);
            if (!updatedRoom) {
                (0, socket_gateway_1.emitProductError)(socket, createProductError(error_types_1.ProductErrorCode.ROOM_NOT_FOUND, payload.roomCode));
                return;
            }
            (0, socket_gateway_1.emitProductCleared)(io, payload.roomCode, { roomCode: payload.roomCode });
            (0, socket_gateway_1.emitRoomUpdated)(io, payload.roomCode, updatedRoom);
        });
    });
}
