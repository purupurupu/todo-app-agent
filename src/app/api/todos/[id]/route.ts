import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Todoの更新リクエストのバリデーションスキーマ
const updateTodoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }).optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['backlog', 'todo', 'in-progress', 'done']).optional(),
  order: z.number().optional().nullable()
});

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     description: 特定のTodoを取得する
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TodoのID
 *     responses:
 *       200:
 *         description: 成功時
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todoが見つからない
 *       500:
 *         description: サーバーエラー
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todoが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ todo }, { status: 200 });
  } catch (error) {
    console.error('Todo fetch error:', error);
    return NextResponse.json(
      { error: 'Todoの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     description: 特定のTodoを更新する
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TodoのID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [backlog, todo, in-progress, done]
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: バリデーションエラー
 *       404:
 *         description: Todoが見つからない
 *       500:
 *         description: サーバーエラー
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    // Todoの存在確認
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todoが見つかりません' },
        { status: 404 }
      );
    }
    
    // リクエストデータのバリデーション
    const validationResult = updateTodoSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    const todoData = validationResult.data;
    
    // Todoの更新
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: todoData
    });
    
    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error) {
    console.error('Todo update error:', error);
    return NextResponse.json(
      { error: 'Todoの更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     description: 特定のTodoを削除する
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TodoのID
 *     responses:
 *       200:
 *         description: 削除成功
 *       404:
 *         description: Todoが見つからない
 *       500:
 *         description: サーバーエラー
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Todoの存在確認
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todoが見つかりません' },
        { status: 404 }
      );
    }
    
    // Todoの削除
    await prisma.todo.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Todoを削除しました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Todo deletion error:', error);
    return NextResponse.json(
      { error: 'Todoの削除に失敗しました' },
      { status: 500 }
    );
  }
} 