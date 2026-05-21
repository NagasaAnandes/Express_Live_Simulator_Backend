"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSuccessResponse = buildSuccessResponse;
exports.buildErrorResponse = buildErrorResponse;
function buildSuccessResponse(data) {
    return { success: true, data };
}
function buildErrorResponse(code, message, details) {
    return {
        success: false,
        error: {
            code,
            message,
            details,
        },
    };
}
