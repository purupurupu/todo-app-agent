'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useOptimisticTodos = (initialTodos: Todo[]) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isLoading] = useState(false);

  // 初期データが変更された場合に更新
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  // 新しいTODOをオプティミスティックに追加
  const optimisticAddTodo = (todoData: Omit<TodoFormData, 'description'> & { description?: string | null }) => {
    const now = new Date();
    const newTodo: Todo = {
      id: uuidv4(), // 一時的なID
      title: todoData.title,
      completed: todoData.completed ?? false,
      priority: todoData.priority ?? 'medium',
      description: todoData.description ?? null,
      status: todoData.status ?? 'todo',
      order: todoData.order ?? 0,
      createdAt: now,
      updatedAt: now
    };
    
    setTodos((prev) => [newTodo, ...prev]);
  };

  // TODOをオプティミスティックに更新
  const optimisticUpdateTodo = (id: string, todoData: Partial<Omit<TodoFormData, 'description'> & { description?: string | null }>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...todoData,
              updatedAt: new Date()
            }
          : todo
      )
    );
  };

  // TODOをオプティミスティックに削除
  const optimisticDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 完了状態をオプティミスティックに切り替え
  const optimisticToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const completed = !todo.completed;
          return {
            ...todo,
            completed,
            status: completed ? 'done' : todo.status === 'done' ? 'todo' : todo.status,
            updatedAt: new Date()
          };
        }
        return todo;
      })
    );
  };

  // ステータスをオプティミスティックに変更
  const optimisticChangeStatus = (id: string, status: Todo['status']) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const completed = status === 'done';
          return {
            ...todo,
            status,
            completed,
            updatedAt: new Date()
          };
        }
        return todo;
      })
    );
  };

  return {
    todos,
    isLoading,
    setTodos,
    optimisticAddTodo,
    optimisticUpdateTodo,
    optimisticDeleteTodo,
    optimisticToggleComplete,
    optimisticChangeStatus
  };
}; 