'use client';

import React from 'react';
import { AppLayout } from './components/AppLayout';
import { useTodos } from './hooks/useTodos';
import Link from 'next/link';

export default function Home() {
  const { todos, isLoading } = useTodos();
  
  // 統計情報の計算
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // ステータス別のタスク数
  const backlogTasks = todos.filter(todo => todo.status === 'backlog').length;
  const todoTasks = todos.filter(todo => todo.status === 'todo').length;
  const inProgressTasks = todos.filter(todo => todo.status === 'in-progress').length;
  const doneTasks = todos.filter(todo => todo.status === 'done').length;
  
  // 優先度別のタスク数
  const highPriorityTasks = todos.filter(todo => todo.priority === 'high').length;
  const mediumPriorityTasks = todos.filter(todo => todo.priority === 'medium').length;
  const lowPriorityTasks = todos.filter(todo => todo.priority === 'low').length;

  return (
    <AppLayout>
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ダッシュボード</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            タスク管理の概要を確認できます
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {/* 概要カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">総タスク数</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalTasks}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">完了タスク</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">進行中タスク</h3>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressTasks}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">完了率</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</p>
              </div>
            </div>
            
            {/* ステータス別と優先度別のカード */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* ステータス別 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">ステータス別タスク</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">バックログ</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{backlogTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-gray-500 dark:bg-gray-500 h-2.5 rounded-full" style={{ width: `${(backlogTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">TODO</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{todoTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-500 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: `${(todoTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">進行中</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{inProgressTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-yellow-500 dark:bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">完了</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doneTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-green-500 dark:bg-green-500 h-2.5 rounded-full" style={{ width: `${(doneTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 優先度別 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">優先度別タスク</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">高</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{highPriorityTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-red-500 dark:bg-red-500 h-2.5 rounded-full" style={{ width: `${(highPriorityTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">中</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mediumPriorityTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-yellow-500 dark:bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(mediumPriorityTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">低</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{lowPriorityTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-500 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: `${(lowPriorityTasks / totalTasks) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* クイックアクセス */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">クイックアクセス</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/list" className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">リスト表示</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">タスクをリスト形式で管理</p>
                  </div>
                </Link>
                
                <Link href="/kanban" className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">カンバンボード</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ドラッグ＆ドロップでタスク管理</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
