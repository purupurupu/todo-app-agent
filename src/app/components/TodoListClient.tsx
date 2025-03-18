'use client';

import React, { useState } from 'react';
import { TodoList } from './TodoList';
import { TodoForm } from './TodoForm';
import { Todo, TodoFormData } from '../types';
import { createTodo, updateTodo, deleteTodo } from '../actions/todoActions';
import { useOptimisticTodos } from '../hooks/useOptimisticTodos';

interface TodoListClientProps {
  initialTodos: Todo[];
}

export const TodoListClient: React.FC<TodoListClientProps> = ({ initialTodos }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { todos, isLoading, optimisticAddTodo, optimisticUpdateTodo, optimisticDeleteTodo, optimisticToggleComplete } = 
    useOptimisticTodos(initialTodos);

  const handleAddTodo = async (data: TodoFormData) => {
    setIsSubmitting(true);
    try {
      // オプティミスティックUIの更新
      optimisticAddTodo(data);
      // サーバーアクションの実行
      await createTodo(data);
    } catch (error) {
      console.error('Todo追加エラー:', error);
      // エラー処理
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTodo = async (id: string, data: Partial<TodoFormData>) => {
    try {
      // オプティミスティックUIの更新
      optimisticUpdateTodo(id, data);
      // サーバーアクションの実行
      await updateTodo(id, data);
    } catch (error) {
      console.error('Todo更新エラー:', error);
      // エラー処理
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      // オプティミスティックUIの更新
      optimisticDeleteTodo(id);
      // サーバーアクションの実行
      await deleteTodo(id);
    } catch (error) {
      console.error('Todo削除エラー:', error);
      // エラー処理
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((t: Todo) => t.id === id);
    if (!todo) return;

    try {
      // オプティミスティックUIの更新
      optimisticToggleComplete(id);
      // サーバーアクションの実行
      await updateTodo(id, { 
        completed: !todo.completed,
        status: !todo.completed ? 'done' : todo.status === 'done' ? 'todo' : todo.status
      });
    } catch (error) {
      console.error('完了ステータス更新エラー:', error);
      // エラー処理
    }
  };

  return (
    <>
      <div className="mb-8">
        <TodoForm onSubmit={handleAddTodo} isSubmitting={isSubmitting} />
      </div>
      
      <div className="flex-1">
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />
      </div>
    </>
  );
}; 