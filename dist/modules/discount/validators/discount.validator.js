"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiscountType = validateDiscountType;
exports.validateDiscountRoomAccess = validateDiscountRoomAccess;
exports.validateStartDiscountPayload = validateStartDiscountPayload;
exports.validateStopDiscountPayload = validateStopDiscountPayload;
const room_manager_1 = require("../../../socket/rooms/room.manager");
const error_types_1 = require("../../../types/error.types");
const socket_types_1 = require("../../../types/socket.types");
const DISCOUNT_ERROR_MESSAGES = {
    [error_types_1.DiscountErrorCode.ROOM_NOT_FOUND]: "Room not found.",
    [error_types_1.DiscountErrorCode.ROOM_MISMATCH]: "Socket is not attached to that room.",
    [error_types_1.DiscountErrorCode.INVALID_ROLE]: "Only the operator can manage the discount overlay.",
    [error_types_1.DiscountErrorCode.INVALID_TYPE]: "Invalid discount type.",
    [error_types_1.DiscountErrorCode.INVALID_VALUE]: "Invalid discount value.",
    [error_types_1.DiscountErrorCode.LABEL_REQUIRED]: "Discount label is required.",
};
function createDiscountError(code, roomCode, type) {
    return {
        code,
        message: DISCOUNT_ERROR_MESSAGES[code],
        roomCode,
        type,
    };
}
function hasLabel(label) {
    return typeof label === "string" && label.trim().length > 0;
}
function validateDiscountType(type) {
    if (!Object.values(socket_types_1.DiscountType).includes(type)) {
        return createDiscountError(error_types_1.DiscountErrorCode.INVALID_TYPE, undefined);
    }
    return null;
}
function validateDiscountRoomAccess(roomCode, socketRoomCode, role) {
    const room = room_manager_1.roomManager.getRoom(roomCode);
    if (!room) {
        return createDiscountError(error_types_1.DiscountErrorCode.ROOM_NOT_FOUND, roomCode);
    }
    if (!socketRoomCode || socketRoomCode !== roomCode) {
        return createDiscountError(error_types_1.DiscountErrorCode.ROOM_MISMATCH, roomCode);
    }
    if (role !== socket_types_1.ParticipantRole.OPERATOR) {
        return createDiscountError(error_types_1.DiscountErrorCode.INVALID_ROLE, roomCode);
    }
    return null;
}
function validateStartDiscountPayload(payload) {
    const typeError = validateDiscountType(payload.type);
    if (typeError) {
        return createDiscountError(error_types_1.DiscountErrorCode.INVALID_TYPE, payload.roomCode);
    }
    const requiresLabel = payload.type !== socket_types_1.DiscountType.FREE_SHIPPING;
    if (requiresLabel && !hasLabel(payload.label)) {
        return createDiscountError(error_types_1.DiscountErrorCode.LABEL_REQUIRED, payload.roomCode, payload.type);
    }
    switch (payload.type) {
        case socket_types_1.DiscountType.PERCENTAGE: {
            if (typeof payload.value !== "number" || !Number.isFinite(payload.value)) {
                return createDiscountError(error_types_1.DiscountErrorCode.INVALID_VALUE, payload.roomCode, payload.type);
            }
            if (payload.value < 1 || payload.value > 100) {
                return createDiscountError(error_types_1.DiscountErrorCode.INVALID_VALUE, payload.roomCode, payload.type);
            }
            return null;
        }
        case socket_types_1.DiscountType.FIXED: {
            if (typeof payload.value !== "number" || !Number.isFinite(payload.value)) {
                return createDiscountError(error_types_1.DiscountErrorCode.INVALID_VALUE, payload.roomCode, payload.type);
            }
            if (payload.value <= 0) {
                return createDiscountError(error_types_1.DiscountErrorCode.INVALID_VALUE, payload.roomCode, payload.type);
            }
            return null;
        }
        case socket_types_1.DiscountType.FLASH_SALE:
        case socket_types_1.DiscountType.FREE_SHIPPING:
            return null;
        default:
            return createDiscountError(error_types_1.DiscountErrorCode.INVALID_TYPE, payload.roomCode, payload.type);
    }
}
function validateStopDiscountPayload(payload) {
    if (typeof payload.roomCode !== "string" || payload.roomCode.trim().length === 0) {
        return createDiscountError(error_types_1.DiscountErrorCode.ROOM_NOT_FOUND);
    }
    return null;
}
