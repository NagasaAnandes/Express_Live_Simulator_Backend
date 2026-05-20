"use strict";
// Utility helpers are kept isolated so shared low-level helpers do not leak into domain modules.
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomCode = generateRoomCode;
const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateRoomCode(length = 6) {
    const characters = Array.from({ length }, () => {
        const index = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
        return ROOM_CODE_ALPHABET[index];
    });
    return characters.join("");
}
