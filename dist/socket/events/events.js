"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = void 0;
// Centralized socket event names keep the realtime contract consistent across modules.
exports.SOCKET_EVENTS = {
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    SHOW_PRODUCT: "SHOW_PRODUCT",
    START_DISCOUNT: "START_DISCOUNT",
    SHOW_COMMENT: "SHOW_COMMENT",
};
