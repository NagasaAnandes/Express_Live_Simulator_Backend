"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitRoomUpdated = emitRoomUpdated;
exports.emitRoomCreated = emitRoomCreated;
exports.emitRoomJoined = emitRoomJoined;
exports.emitProductUpdated = emitProductUpdated;
exports.emitProductUpdatedToSocket = emitProductUpdatedToSocket;
exports.emitProductCleared = emitProductCleared;
exports.emitRoomError = emitRoomError;
exports.emitProductError = emitProductError;
const events_1 = require("../events/events");
const response_builder_1 = require("./builders/response.builder");
function emitRoomUpdated(io, roomCode, roomState) {
    io.to(roomCode).emit(events_1.SERVER_EVENTS.ROOM_UPDATED, (0, response_builder_1.buildSuccessResponse)(roomState));
}
function emitRoomCreated(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.ROOM_CREATED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitRoomJoined(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.ROOM_JOINED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitProductUpdated(io, roomCode, payload) {
    io.to(roomCode).emit(events_1.SERVER_EVENTS.PRODUCT_UPDATED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitProductUpdatedToSocket(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.PRODUCT_UPDATED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitProductCleared(io, roomCode, payload) {
    io.to(roomCode).emit(events_1.SERVER_EVENTS.PRODUCT_CLEARED, (0, response_builder_1.buildSuccessResponse)(payload));
}
function emitRoomError(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.ROOM_ERROR, (0, response_builder_1.buildErrorResponse)(payload.code, payload.message, { roomCode: payload.roomCode }));
}
function emitProductError(socket, payload) {
    socket.emit(events_1.SERVER_EVENTS.PRODUCT_ERROR, (0, response_builder_1.buildErrorResponse)(payload.code, payload.message, { roomCode: payload.roomCode, productId: payload.productId }));
}
