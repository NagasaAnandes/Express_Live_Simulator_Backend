// Centralized socket event names keep the realtime contract consistent across modules.
export const SOCKET_EVENTS = {
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  SHOW_PRODUCT: "SHOW_PRODUCT",
  START_DISCOUNT: "START_DISCOUNT",
  SHOW_COMMENT: "SHOW_COMMENT",
} as const;

export type SocketEventName =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
