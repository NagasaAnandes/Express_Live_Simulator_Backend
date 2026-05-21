// Centralized application error codes and API response shapes

export enum RoomErrorCode {
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_FULL = "ROOM_FULL",
  ROLE_ALREADY_USED = "ROLE_ALREADY_USED",
  INVALID_ROLE = "INVALID_ROLE",
}

export enum ProductErrorCode {
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_MISMATCH = "ROOM_MISMATCH",
  INVALID_ROLE = "INVALID_ROLE",
}

export enum DiscountErrorCode {
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_MISMATCH = "ROOM_MISMATCH",
  INVALID_ROLE = "INVALID_ROLE",
  INVALID_TYPE = "INVALID_TYPE",
  INVALID_VALUE = "INVALID_VALUE",
  LABEL_REQUIRED = "LABEL_REQUIRED",
}

export enum AppErrorCode {
  UNKNOWN = "UNKNOWN",
  UNAUTHORIZED_ROLE = "UNAUTHORIZED_ROLE",
}

export interface ErrorPayload {
  code:
    | RoomErrorCode
    | ProductErrorCode
    | DiscountErrorCode
    | AppErrorCode
    | string;
  message: string;
  details?: Record<string, unknown> | undefined;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: ErrorPayload;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
