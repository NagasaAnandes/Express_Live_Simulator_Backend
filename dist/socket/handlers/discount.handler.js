"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRecorderDiscountOverlay = syncRecorderDiscountOverlay;
exports.registerDiscountHandler = registerDiscountHandler;
const events_1 = require("../events/events");
const discount_service_1 = require("../../modules/discount/discount.service");
const socket_types_1 = require("../../types/socket.types");
const discount_gateway_1 = require("../gateway/discount.gateway");
const socket_gateway_1 = require("../gateway/socket.gateway");
function syncRecorderDiscountOverlay(socket, roomState) {
    if (!roomState.activeDiscount || socket.data.role !== socket_types_1.ParticipantRole.RECORDER) {
        return;
    }
    (0, discount_gateway_1.emitDiscountUpdatedToSocket)(socket, {
        roomCode: roomState.roomCode,
        discount: roomState.activeDiscount,
    });
}
function registerDiscountHandler(io) {
    io.on("connection", (socket) => {
        socket.on(events_1.CLIENT_EVENTS.START_DISCOUNT, (payload) => {
            const result = discount_service_1.discountService.startDiscount(socket.data.roomCode, socket.data.role, payload);
            if (!result.ok) {
                (0, discount_gateway_1.emitDiscountError)(socket, result.error);
                return;
            }
            const updatedPayload = {
                roomCode: result.room.roomCode,
                discount: result.discount ?? result.room.activeDiscount,
            };
            (0, discount_gateway_1.emitDiscountUpdated)(io, result.room.roomCode, updatedPayload);
            (0, socket_gateway_1.emitRoomUpdated)(io, result.room.roomCode, result.room);
        });
        socket.on(events_1.CLIENT_EVENTS.STOP_DISCOUNT, (payload) => {
            const result = discount_service_1.discountService.stopDiscount(socket.data.roomCode, socket.data.role, payload);
            if (!result.ok) {
                (0, discount_gateway_1.emitDiscountError)(socket, result.error);
                return;
            }
            const clearedPayload = {
                roomCode: result.room.roomCode,
            };
            (0, discount_gateway_1.emitDiscountCleared)(io, result.room.roomCode, clearedPayload);
            (0, socket_gateway_1.emitRoomUpdated)(io, result.room.roomCode, result.room);
        });
    });
}
