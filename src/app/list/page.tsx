import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { TodoListClient } from '../components/TodoListClient';
import { getTodos } from '../actions/todoActions';

export default async function ListPage() {
  // サーバーサイドでデータを取得
  const todos = await getTodos();

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">リスト表示</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            タスクをリスト形式で管理します
          </p>
        </div>
        
        <TodoListClient initialTodos={todos} />
      </div>
    </AppLayout>
  );
} 