import React from 'react';
import { AppLayout } from './components/AppLayout';
import { DashboardClient } from './components/DashboardClient';
import { getTodos } from './actions/todoActions';

export default async function Home() {
  // サーバーサイドでデータを取得
  const todos = await getTodos();
  
  return (
    <AppLayout>
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ダッシュボード</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            タスク管理の概要を確認できます
          </p>
        </div>
        
        <DashboardClient todos={todos} />
      </div>
    </AppLayout>
  );
}
