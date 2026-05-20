// Centralized socket event names keep the realtime contract consistent across modules.
export enum SocketClientEvent {
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
}

export enum SocketServerEvent {
  ROOM_CREATED = "ROOM_CREATED",
  ROOM_JOINED = "ROOM_JOINED",
  ROOM_UPDATED = "ROOM_UPDATED",
  ROOM_ERROR = "ROOM_ERROR",
}

export enum RoomErrorCode {
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_FULL = "ROOM_FULL",
  ROLE_ALREADY_USED = "ROLE_ALREADY_USED",
  INVALID_ROLE = "INVALID_ROLE",
}
