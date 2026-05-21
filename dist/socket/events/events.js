"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountErrorCode = exports.ProductErrorCode = exports.RoomErrorCode = exports.SERVER_EVENTS = exports.CLIENT_EVENTS = void 0;
// Centralized socket event names keep the realtime contract consistent across modules.
exports.CLIENT_EVENTS = {
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    SHOW_PRODUCT: "SHOW_PRODUCT",
    CLEAR_PRODUCT: "CLEAR_PRODUCT",
    START_DISCOUNT: "START_DISCOUNT",
    STOP_DISCOUNT: "STOP_DISCOUNT",
};
exports.SERVER_EVENTS = {
    ROOM_CREATED: "ROOM_CREATED",
    ROOM_JOINED: "ROOM_JOINED",
    ROOM_UPDATED: "ROOM_UPDATED",
    ROOM_ERROR: "ROOM_ERROR",
    PRODUCT_UPDATED: "PRODUCT_UPDATED",
    PRODUCT_CLEARED: "PRODUCT_CLEARED",
    PRODUCT_ERROR: "PRODUCT_ERROR",
    DISCOUNT_UPDATED: "DISCOUNT_UPDATED",
    DISCOUNT_CLEARED: "DISCOUNT_CLEARED",
    DISCOUNT_ERROR: "DISCOUNT_ERROR",
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
var DiscountErrorCode;
(function (DiscountErrorCode) {
    DiscountErrorCode["ROOM_NOT_FOUND"] = "ROOM_NOT_FOUND";
    DiscountErrorCode["ROOM_MISMATCH"] = "ROOM_MISMATCH";
    DiscountErrorCode["INVALID_ROLE"] = "INVALID_ROLE";
    DiscountErrorCode["INVALID_TYPE"] = "INVALID_TYPE";
    DiscountErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
    DiscountErrorCode["LABEL_REQUIRED"] = "LABEL_REQUIRED";
})(DiscountErrorCode || (exports.DiscountErrorCode = DiscountErrorCode = {}));
