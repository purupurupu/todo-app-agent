'use client';

import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { KanbanBoard } from '../components/KanbanBoard';
import { useTodos } from '../hooks/useTodos';

export default function KanbanPage() {
  const {
    todos,
    isLoading,
    updateTodo,
    deleteTodo,
    toggleComplete,
    changeStatus,
    moveTodo,
  } = useTodos();

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">カンバンボード</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            ドラッグ＆ドロップでタスクを管理できます
          </p>
        </div>
        
        <div className="flex-1">
          <KanbanBoard
            todos={todos}
            isLoading={isLoading}
            onToggleComplete={toggleComplete}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            onChangeStatus={changeStatus}
            onMoveTodo={moveTodo}
          />
        </div>
      </div>
    </AppLayout>
  );
} 