'use client';

import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { useTodos } from '../hooks/useTodos';
import { TodoFormData } from '../types';

export default function ListPage() {
  const {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodos();

  const handleAddTodo = (data: TodoFormData) => {
    addTodo(data);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">リスト表示</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            タスクをリスト形式で管理します
          </p>
        </div>
        
        <div className="mb-8">
          <TodoForm onSubmit={handleAddTodo} />
        </div>
        
        <div className="flex-1">
          <TodoList
            todos={todos}
            isLoading={isLoading}
            onToggleComplete={toggleComplete}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </div>
      </div>
    </AppLayout>
  );
} 