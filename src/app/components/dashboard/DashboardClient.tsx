'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Todo, TodoStatus } from '@/app/types';
import { useOptimisticTodos } from '@/app/hooks/useOptimisticTodos';
import { TodoForm } from '../shared/TodoForm';
import { deleteTodo, updateTodoStatus } from '@/app/actions/todoActions';

interface DashboardClientProps {
  initialTodos: Todo[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ initialTodos }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | 'all'>('all');
  const { todos, addOptimisticTodo, updateOptimisticTodo, deleteOptimisticTodo } = useOptimisticTodos(initialTodos);

  const handleStatusChange = async (id: string, newStatus: TodoStatus) => {
    // 楽観的UIアップデートを実行
    updateOptimisticTodo(id, { status: newStatus });
    
    // サーバーアクションを呼び出し
    try {
      await updateTodoStatus(id, newStatus);
    } catch (error) {
      console.error('Failed to update todo status:', error);
      // エラーが発生した場合は、最適化を元に戻す必要があります
      // （本番環境では、よりロバストなエラー処理が必要です）
    }
  };

  const handleDelete = async (id: string) => {
    // 楽観的UI更新
    deleteOptimisticTodo(id);
    
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
              addOptimisticTodo(newTodo);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">全てのタスク</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{todos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">未着手</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{statusCounts['NOT_STARTED'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">進行中</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{statusCounts['IN_PROGRESS'] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">完了</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{statusCounts['COMPLETED'] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">最近のタスク</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-md ${
                filterStatus === 'all' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              全て
            </button>
            <button 
              onClick={() => setFilterStatus('NOT_STARTED')}
              className={`px-3 py-1 rounded-md ${
                filterStatus === 'NOT_STARTED' 
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              未着手
            </button>
            <button 
              onClick={() => setFilterStatus('IN_PROGRESS')}
              className={`px-3 py-1 rounded-md ${
                filterStatus === 'IN_PROGRESS' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              進行中
            </button>
            <button 
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-3 py-1 rounded-md ${
                filterStatus === 'COMPLETED' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              完了
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">タスクがありません</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTodos.slice(0, 5).map((todo) => (
                <li key={todo.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <select
                          value={todo.status}
                          onChange={(e) => handleStatusChange(todo.id, e.target.value as TodoStatus)}
                          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="NOT_STARTED">未着手</option>
                          <option value="IN_PROGRESS">進行中</option>
                          <option value="COMPLETED">完了</option>
                        </select>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          <Link href={`/list?id=${todo.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            {todo.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">{todo.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        todo.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : todo.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {todo.priority === 'HIGH' ? '高' : todo.priority === 'MEDIUM' ? '中' : '低'}
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
            </ul>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/list"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            すべてのタスクを表示
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}; 