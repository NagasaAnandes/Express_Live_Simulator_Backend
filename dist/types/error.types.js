"use strict";
// Centralized application error codes and API response shapes
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrorCode = exports.DiscountErrorCode = exports.ProductErrorCode = exports.RoomErrorCode = void 0;
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
var DiscountErrorCode;
(function (DiscountErrorCode) {
    DiscountErrorCode["ROOM_NOT_FOUND"] = "ROOM_NOT_FOUND";
    DiscountErrorCode["ROOM_MISMATCH"] = "ROOM_MISMATCH";
    DiscountErrorCode["INVALID_ROLE"] = "INVALID_ROLE";
    DiscountErrorCode["INVALID_TYPE"] = "INVALID_TYPE";
    DiscountErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
    DiscountErrorCode["LABEL_REQUIRED"] = "LABEL_REQUIRED";
})(DiscountErrorCode || (exports.DiscountErrorCode = DiscountErrorCode = {}));
var AppErrorCode;
(function (AppErrorCode) {
    AppErrorCode["UNKNOWN"] = "UNKNOWN";
    AppErrorCode["UNAUTHORIZED_ROLE"] = "UNAUTHORIZED_ROLE";
})(AppErrorCode || (exports.AppErrorCode = AppErrorCode = {}));
