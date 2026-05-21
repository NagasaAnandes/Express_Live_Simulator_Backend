import type { ApiResponse } from "../../../types/error.types";

export function buildSuccessResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data } as ApiResponse<T>;
}

export function buildErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): ApiResponse<null> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  } as ApiResponse<null>;
}
