import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Todoの作成リクエストのバリデーションスキーマ
const createTodoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }),
  completed: z.boolean().optional().default(false),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in-progress', 'done']).optional().default('todo'),
  order: z.number().optional()
});

/**
 * @swagger
 * /api/todos:
 *   get:
 *     description: Todoの一覧を取得する
 *     responses:
 *       200:
 *         description: 成功時
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 */
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { updatedAt: 'desc' }
      ]
    });

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error('Todos fetch error:', error);
    return NextResponse.json(
      { error: 'Todoの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/todos:
 *   post:
 *     description: 新しいTodoを作成する
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *                 default: false
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [backlog, todo, in-progress, done]
 *                 default: todo
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: 作成成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: バリデーションエラー
 *       500:
 *         description: サーバーエラー
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // リクエストデータのバリデーション
    const validationResult = createTodoSchema.safeParse(body);
    
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
    
    // Todoの作成
    const todo = await prisma.todo.create({
      data: todoData
    });
    
    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    console.error('Todo creation error:', error);
    return NextResponse.json(
      { error: 'Todoの作成に失敗しました' },
      { status: 500 }
    );
  }
} 