import { NextResponse } from 'next/server';

type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
  details?: unknown;
};

/**
 * 成功レスポンスを返す関数
 */
export function successResponse<T>(data: T, message?: string, status = 200) {
  const response: ApiResponse<T> = {
    data,
    message,
  };
  return NextResponse.json(response, { status });
}

/**
 * エラーレスポンスを返す関数
 */
export function errorResponse(error: string, details?: unknown, status = 500) {
  const response: ApiResponse<null> = {
    error,
    details,
  };
  return NextResponse.json(response, { status });
}

/**
 * 作成成功レスポンスを返す関数
 */
export function createdResponse<T>(data: T, message?: string) {
  return successResponse(data, message, 201);
}

/**
 * バリデーションエラーレスポンスを返す関数
 */
export function validationErrorResponse(details: unknown) {
  return errorResponse('バリデーションエラー', details, 400);
}

/**
 * リソースが見つからないエラーレスポンスを返す関数
 */
export function notFoundResponse(resource: string) {
  return errorResponse(`${resource}が見つかりません`, null, 404);
} 