'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Todo } from '@/app/types';
import { useOptimisticTodos } from '@/app/hooks/useOptimisticTodos';
import { TodoForm } from '../shared/TodoForm';
import { deleteTodo } from '@/app/actions/todoActions';

type TodoStatus = 'backlog' | 'todo' | 'in-progress' | 'done';

interface DashboardClientProps {
  initialTodos: Todo[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ initialTodos }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | 'all'>('all');
  const { todos, optimisticAddTodo, optimisticDeleteTodo } = useOptimisticTodos(initialTodos);

  const handleDelete = async (id: string) => {
    // 楽観的UI更新
    optimisticDeleteTodo(id);
    
    // サーバーアクションを呼び出し
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      // エラー発生時の処理
    }
  };

  // フィルタリングされたToDoを取得
  const filteredTodos = filterStatus === 'all' 
    ? todos 
    : todos.filter(todo => todo.status === filterStatus);

  // ステータス別のToDoの数をカウント
  const statusCounts = todos.reduce((acc, todo) => {
    acc[todo.status] = (acc[todo.status] || 0) + 1;
    return acc;
  }, {} as Record<TodoStatus, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ダッシュボード</h1>
          <p className="text-gray-600 dark:text-gray-300">タスクの概要と最近のアクティビティ</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          新しいタスク
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <TodoForm 
            onClose={() => setShowForm(false)} 
            onAddTodo={(newTodo) => {
              optimisticAddTodo(newTodo);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ステータスサマリーカード */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">ステータス別集計</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">未着手</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {statusCounts['todo'] || 0}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">進行中</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {statusCounts['in-progress'] || 0}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">完了</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                {statusCounts['done'] || 0}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">バックログ</span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                {statusCounts['backlog'] || 0}
              </span>
            </li>
          </ul>
        </div>

        {/* 最近のタスク */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">タスク一覧</h2>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TodoStatus | 'all')}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              >
                <option value="all">すべて</option>
                <option value="todo">未着手</option>
                <option value="in-progress">進行中</option>
                <option value="done">完了</option>
                <option value="backlog">バックログ</option>
              </select>
            </div>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              表示するタスクがありません
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTodos.slice(0, 5).map((todo) => (
                <li key={todo.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/list?id=${todo.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        {todo.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {todo.description && todo.description.length > 100
                          ? todo.description.substring(0, 100) + '...'
                          : todo.description || '説明なし'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${todo.status === 'todo' ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200' :
                          todo.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          todo.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                        {todo.status === 'todo' ? '未着手' :
                          todo.status === 'in-progress' ? '進行中' :
                          todo.status === 'done' ? '完了' : 'バックログ'}
                      </span>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {filteredTodos.length > 5 && (
                <div className="text-center pt-2">
                  <Link href="/list" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                    すべてのタスクを表示 ({filteredTodos.length})
                  </Link>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}; 