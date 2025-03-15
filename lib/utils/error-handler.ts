import { ZodError } from 'zod';
import { errorResponse, validationErrorResponse } from './api-response';

/**
 * APIハンドラー内でのエラーを処理する関数
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Zodのバリデーションエラーをハンドリング
  if (error instanceof ZodError) {
    return validationErrorResponse(error.errors);
  }

  // Prismaのエラーをハンドリング
  if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
    // ユニーク制約違反などの特定のエラーを処理
    if ('code' in error && error.code === 'P2002') {
      return errorResponse('一意制約違反が発生しました', null, 409);
    }
  }

  // 一般的なエラーをハンドリング
  const message = error instanceof Error ? error.message : '不明なエラーが発生しました';
  return errorResponse(message);
} 