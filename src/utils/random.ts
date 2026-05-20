// Utility helpers are kept isolated so shared low-level helpers do not leak into domain modules.

const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 6): string {
  const characters = Array.from({ length }, () => {
    const index = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
    return ROOM_CODE_ALPHABET[index];
  });

  return characters.join("");
}
