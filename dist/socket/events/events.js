"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrorCode = exports.RoomErrorCode = exports.SERVER_EVENTS = exports.CLIENT_EVENTS = void 0;
// Centralized socket event names keep the realtime contract consistent across modules.
exports.CLIENT_EVENTS = {
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SHOW_PRODUCT: "SHOW_PRODUCT",
    CLEAR_PRODUCT: "CLEAR_PRODUCT",
};
exports.SERVER_EVENTS = {
    ROOM_CREATED: "ROOM_CREATED",
    ROOM_JOINED: "ROOM_JOINED",
    ROOM_UPDATED: "ROOM_UPDATED",
    ROOM_ERROR: "ROOM_ERROR",
    PRODUCT_UPDATED: "PRODUCT_UPDATED",
    PRODUCT_CLEARED: "PRODUCT_CLEARED",
    PRODUCT_ERROR: "PRODUCT_ERROR",
};
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
