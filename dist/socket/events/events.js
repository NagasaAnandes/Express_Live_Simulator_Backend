"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrorCode = exports.RoomErrorCode = exports.SocketServerEvent = exports.SocketClientEvent = void 0;
// Centralized socket event names keep the realtime contract consistent across modules.
var SocketClientEvent;
(function (SocketClientEvent) {
    SocketClientEvent["CREATE_ROOM"] = "CREATE_ROOM";
    SocketClientEvent["JOIN_ROOM"] = "JOIN_ROOM";
    SocketClientEvent["LEAVE_ROOM"] = "LEAVE_ROOM";
    SocketClientEvent["SHOW_PRODUCT"] = "SHOW_PRODUCT";
    SocketClientEvent["CLEAR_PRODUCT"] = "CLEAR_PRODUCT";
})(SocketClientEvent || (exports.SocketClientEvent = SocketClientEvent = {}));
var SocketServerEvent;
(function (SocketServerEvent) {
    SocketServerEvent["ROOM_CREATED"] = "ROOM_CREATED";
    SocketServerEvent["ROOM_JOINED"] = "ROOM_JOINED";
    SocketServerEvent["ROOM_UPDATED"] = "ROOM_UPDATED";
    SocketServerEvent["ROOM_ERROR"] = "ROOM_ERROR";
    SocketServerEvent["PRODUCT_UPDATED"] = "PRODUCT_UPDATED";
    SocketServerEvent["PRODUCT_CLEARED"] = "PRODUCT_CLEARED";
    SocketServerEvent["PRODUCT_ERROR"] = "PRODUCT_ERROR";
})(SocketServerEvent || (exports.SocketServerEvent = SocketServerEvent = {}));
var RoomErrorCode;
(function (RoomErrorCode) {
    RoomErrorCode["ROOM_NOT_FOUND"] = "ROOM_NOT_FOUND";
    RoomErrorCode["ROOM_FULL"] = "ROOM_FULL";
    RoomErrorCode["ROLE_ALREADY_USED"] = "ROLE_ALREADY_USED";
    RoomErrorCode["INVALID_ROLE"] = "INVALID_ROLE";
})(RoomErrorCode || (exports.RoomErrorCode = RoomErrorCode = {}));
var ProductErrorCode;
(function (ProductErrorCode) {
    ProductErrorCode["ROOM_NOT_FOUND"] = "ROOM_NOT_FOUND";
    ProductErrorCode["ROOM_MISMATCH"] = "ROOM_MISMATCH";
    ProductErrorCode["INVALID_ROLE"] = "INVALID_ROLE";
    ProductErrorCode["PRODUCT_NOT_FOUND"] = "PRODUCT_NOT_FOUND";
})(ProductErrorCode || (exports.ProductErrorCode = ProductErrorCode = {}));
