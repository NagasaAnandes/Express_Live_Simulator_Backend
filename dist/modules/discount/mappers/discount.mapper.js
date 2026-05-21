"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStartDiscountPayloadToOverlay = mapStartDiscountPayloadToOverlay;
exports.mapDiscountToUpdatedPayload = mapDiscountToUpdatedPayload;
const socket_types_1 = require("../../../types/socket.types");
function mapStartDiscountPayloadToOverlay(payload) {
    const label = payload.label?.trim() ||
        (payload.type === socket_types_1.DiscountType.FREE_SHIPPING ? "Free Shipping" : "");
    return {
        type: payload.type,
        value: payload.value,
        label,
        startedAt: new Date(),
    };
}
function mapDiscountToUpdatedPayload(roomCode, discount) {
    return {
        roomCode,
        discount: { ...discount },
    };
}
