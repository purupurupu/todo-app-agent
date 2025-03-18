'use client';

import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">設定</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            アプリケーションの設定を管理できます
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid gap-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">一般設定</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                今後ここに一般設定のオプションが追加されます。
              </p>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">アカウント</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                今後ここにアカウント関連の設定が追加されます。
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">通知</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                今後ここに通知設定が追加されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 