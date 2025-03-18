'use server';

import { PrismaClient } from '@prisma/client';
import { Todo, TodoFormData } from '../types';

const prisma = new PrismaClient();

// TODOリストを取得するサーバーアクション
export async function getTodos(): Promise<Todo[]> {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { updatedAt: 'desc' }
      ]
    });

    // DBから取得したデータを適切な型に変換
    return todos.map(todo => ({
      ...todo,
      priority: todo.priority as 'low' | 'medium' | 'high',
      status: todo.status as 'backlog' | 'todo' | 'in-progress' | 'done',
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    }));
  } catch (error) {
    console.error('Todos fetch error:', error);
    throw new Error('TODOの取得に失敗しました');
  }
}

// 新しいTODOを作成するサーバーアクション
export async function createTodo(todoData: TodoFormData): Promise<Todo> {
  try {
    // Prismaが期待する型に変換
    const prismaData = {
      title: todoData.title,
      completed: todoData.completed,
      priority: todoData.priority,
      description: todoData.description,
      status: todoData.status,
      order: todoData.order ?? null
    };
    
    const todo = await prisma.todo.create({
      data: prismaData
    });
    
    return {
      ...todo,
      priority: todo.priority as 'low' | 'medium' | 'high',
      status: todo.status as 'backlog' | 'todo' | 'in-progress' | 'done'
    };
  } catch (error) {
    console.error('Todo creation error:', error);
    throw new Error('Todoの作成に失敗しました');
  }
}

// TODOを更新するサーバーアクション
export async function updateTodo(
  id: string,
  todoData: Partial<TodoFormData>
): Promise<Todo> {
  try {
    // Prismaが期待する型に変換
    const prismaData = {
      ...(todoData.title !== undefined && { title: todoData.title }),
      ...(todoData.completed !== undefined && { completed: todoData.completed }),
      ...(todoData.priority !== undefined && { priority: todoData.priority }),
      ...(todoData.description !== undefined && { description: todoData.description }),
      ...(todoData.status !== undefined && { status: todoData.status }),
      ...(todoData.order !== undefined && { order: todoData.order })
    };
    
    const todo = await prisma.todo.update({
      where: { id },
      data: prismaData
    });
    
    return {
      ...todo,
      priority: todo.priority as 'low' | 'medium' | 'high',
      status: todo.status as 'backlog' | 'todo' | 'in-progress' | 'done'
    };
  } catch (error) {
    console.error('Todo update error:', error);
    throw new Error('Todoの更新に失敗しました');
  }
}

// TODOを削除するサーバーアクション
export async function deleteTodo(id: string): Promise<void> {
  try {
    await prisma.todo.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Todo deletion error:', error);
    throw new Error('Todoの削除に失敗しました');
  }
}

// 複数のTODOを一括更新するサーバーアクション
export async function batchUpdateTodos(
  updates: { id: string; status: 'backlog' | 'todo' | 'in-progress' | 'done'; order?: number }[]
): Promise<void> {
  try {
    // トランザクションでバッチ更新
    await prisma.$transaction(
      updates.map(({ id, ...data }) =>
        prisma.todo.update({
          where: { id },
          data
        })
      )
    );
  } catch (error) {
    console.error('Batch update error:', error);
    throw new Error('Todoの一括更新に失敗しました');
  }
} 