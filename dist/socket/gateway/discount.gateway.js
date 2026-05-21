"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitDiscountUpdated = emitDiscountUpdated;
exports.emitDiscountUpdatedToSocket = emitDiscountUpdatedToSocket;
exports.emitDiscountCleared = emitDiscountCleared;
exports.emitDiscountError = emitDiscountError;
const events_1 = require("../events/events");
const response_builder_1 = require("./builders/response.builder");
function emitDiscountUpdated(io, roomCode, payload) {
    io.to(roomCode).emit(events_1.SERVER_EVENTS.DISCOUNT_UPDATED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitDiscountUpdatedToSocket(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.DISCOUNT_UPDATED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitDiscountCleared(io, roomCode, payload) {
    io.to(roomCode).emit(events_1.SERVER_EVENTS.DISCOUNT_CLEARED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitDiscountError(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.DISCOUNT_ERROR, (0, response_builder_1.buildErrorResponse)(payload.code, payload.message, {
        roomCode: payload.roomCode,
        type: payload.type,
    }));
}
