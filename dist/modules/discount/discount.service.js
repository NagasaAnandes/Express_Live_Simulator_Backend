"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountService = exports.DiscountService = void 0;
const error_types_1 = require("../../types/error.types");
const room_manager_1 = require("../../socket/rooms/room.manager");
const discount_mapper_1 = require("./mappers/discount.mapper");
const discount_validator_1 = require("./validators/discount.validator");
const DEFAULT_ROOM_NOT_FOUND_ERROR = {
    code: error_types_1.DiscountErrorCode.ROOM_NOT_FOUND,
    message: "Room not found.",
};
// DiscountService owns the business orchestration for transient room discount state.
class DiscountService {
    startDiscount(socketRoomCode, socketRole, payload) {
        const accessError = (0, discount_validator_1.validateDiscountRoomAccess)(payload.roomCode, socketRoomCode, socketRole);
        if (accessError) {
            return { ok: false, error: accessError };
        }
        const payloadError = (0, discount_validator_1.validateStartDiscountPayload)(payload);
        if (payloadError) {
            return { ok: false, error: payloadError };
        }
        const activeDiscount = (0, discount_mapper_1.mapStartDiscountPayloadToOverlay)(payload);
        const updatedRoom = room_manager_1.roomManager.setDiscountState(payload.roomCode, activeDiscount);
        if (!updatedRoom || !updatedRoom.activeDiscount) {
            return { ok: false, error: { ...DEFAULT_ROOM_NOT_FOUND_ERROR, roomCode: payload.roomCode } };
        }
        return {
            ok: true,
            room: updatedRoom,
            discount: updatedRoom.activeDiscount,
        };
    }
    stopDiscount(socketRoomCode, socketRole, payload) {
        const accessError = (0, discount_validator_1.validateDiscountRoomAccess)(payload.roomCode, socketRoomCode, socketRole);
        if (accessError) {
            return { ok: false, error: accessError };
        }
        const payloadError = (0, discount_validator_1.validateStopDiscountPayload)(payload);
        if (payloadError) {
            return { ok: false, error: payloadError };
        }
        const updatedRoom = room_manager_1.roomManager.clearDiscountState(payload.roomCode);
        if (!updatedRoom) {
            return { ok: false, error: { ...DEFAULT_ROOM_NOT_FOUND_ERROR, roomCode: payload.roomCode } };
        }
        return {
            ok: true,
            room: updatedRoom,
        };
    }
}
exports.DiscountService = DiscountService;
exports.discountService = new DiscountService();
