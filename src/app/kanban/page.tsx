import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { KanbanBoardClient } from '../components/kanban/KanbanBoardClient';
import { getTodos } from '../actions/todoActions';

export default async function KanbanPage() {
  // サーバーサイドでデータを取得
  const todos = await getTodos();

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">カンバンボード</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            タスクをドラッグ＆ドロップで移動できます
          </p>
        </div>
        
        <KanbanBoardClient initialTodos={todos} />
      </div>
    </AppLayout>
  );
} 