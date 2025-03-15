import { z } from 'zod';

/**
 * Todoの基本スキーマ
 */
export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: 'タイトルは必須です' }).max(100, { message: 'タイトルは100文字以内で入力してください' }),
  completed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * 新規Todo作成用のスキーマ（idは自動生成されるため不要）
 */
export const createTodoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }).max(100, { message: 'タイトルは100文字以内で入力してください' }),
  completed: z.boolean().default(false).optional(),
});

/**
 * Todo更新用のスキーマ（部分的な更新を許可）
 */
export const updateTodoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }).max(100, { message: 'タイトルは100文字以内で入力してください' }).optional(),
  completed: z.boolean().optional(),
});

/**
 * Todoの型定義
 */
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>; 