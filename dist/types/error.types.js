"use strict";
// Centralized application error codes and API response shapes
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrorCode = exports.ProductErrorCode = exports.RoomErrorCode = void 0;
var RoomErrorCode;
(function (RoomErrorCode) {
    RoomErrorCode["ROOM_NOT_FOUND"] = "ROOM_NOT_FOUND";
    RoomErrorCode["ROOM_FULL"] = "ROOM_FULL";
    RoomErrorCode["ROLE_ALREADY_USED"] = "ROLE_ALREADY_USED";
    RoomErrorCode["INVALID_ROLE"] = "INVALID_ROLE";
})(RoomErrorCode || (exports.RoomErrorCode = RoomErrorCode = {}));
var ProductErrorCode;
(function (ProductErrorCode) {
    ProductErrorCode["PRODUCT_NOT_FOUND"] = "PRODUCT_NOT_FOUND";
    ProductErrorCode["ROOM_NOT_FOUND"] = "ROOM_NOT_FOUND";
    ProductErrorCode["ROOM_MISMATCH"] = "ROOM_MISMATCH";
    ProductErrorCode["INVALID_ROLE"] = "INVALID_ROLE";
})(ProductErrorCode || (exports.ProductErrorCode = ProductErrorCode = {}));
var AppErrorCode;
(function (AppErrorCode) {
    AppErrorCode["UNKNOWN"] = "UNKNOWN";
    AppErrorCode["UNAUTHORIZED_ROLE"] = "UNAUTHORIZED_ROLE";
})(AppErrorCode || (exports.AppErrorCode = AppErrorCode = {}));
