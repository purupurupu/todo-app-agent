import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// 一括更新リクエストのバリデーションスキーマ
const batchUpdateSchema = z.object({
  todos: z.array(
    z.object({
      id: z.string(),
      status: z.enum(['backlog', 'todo', 'in-progress', 'done']),
      order: z.number().optional()
    })
  )
});

/**
 * @swagger
 * /api/todos/batch-update:
 *   put:
 *     description: 複数のTodoのステータスを一括で更新する
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todos
 *             properties:
 *               todos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - status
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [backlog, todo, in-progress, done]
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: 更新成功
 *       400:
 *         description: バリデーションエラー
 *       500:
 *         description: サーバーエラー
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // リクエストデータのバリデーション
    const validationResult = batchUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    const { todos } = validationResult.data;
    
    // トランザクションを使用して一括更新
    const result = await prisma.$transaction(
      todos.map(todo => {
        // Todoモデルの更新に適した型を使用
        const data: {
          status: string;
          order?: number | null;
        } = {
          status: todo.status
        };
        
        if (todo.order !== undefined) {
          data.order = todo.order;
        }
        
        return prisma.todo.update({
          where: { id: todo.id },
          data
        });
      })
    );
    
    return NextResponse.json(
      { 
        message: `${result.length}件のTodoを更新しました`,
        todos: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { error: 'Todoの一括更新に失敗しました' },
      { status: 500 }
    );
  }
} 