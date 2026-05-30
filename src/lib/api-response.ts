import { NextResponse } from "next/server";

/**
 * Standardized API response helper for consistent response format.
 *
 * Success: { success: true, data: T, message?: string }
 * Error:   { success: false, error: string, code?: string }
 */

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

export function apiSuccess<T>(
  data: T,
  options?: {
    message?: string;
    status?: number;
    meta?: SuccessResponse<T>["meta"];
  }
) {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    ...(options?.message && { message: options.message }),
    ...(options?.meta && { meta: options.meta }),
  };
  return NextResponse.json(body, { status: options?.status ?? 200 });
}

export function apiError(
  error: string,
  options?: {
    status?: number;
    code?: string;
    details?: Record<string, string[]>;
  }
) {
  const body: ErrorResponse = {
    success: false,
    error,
    ...(options?.code && { code: options.code }),
    ...(options?.details && { details: options.details }),
  };
  return NextResponse.json(body, { status: options?.status ?? 400 });
}

/** Common error responses */
export const API_ERRORS = {
  unauthorized: () =>
    apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED" }),
  forbidden: () =>
    apiError("Forbidden", { status: 403, code: "FORBIDDEN" }),
  notFound: (resource = "Resource") =>
    apiError(`${resource} not found`, { status: 404, code: "NOT_FOUND" }),
  validation: (details: Record<string, string[]>) =>
    apiError("Validation failed", {
      status: 422,
      code: "VALIDATION_ERROR",
      details,
    }),
  internal: (message = "Internal server error") =>
    apiError(message, { status: 500, code: "INTERNAL_ERROR" }),
  rateLimit: () =>
    apiError("Too many requests", { status: 429, code: "RATE_LIMIT" }),
};
