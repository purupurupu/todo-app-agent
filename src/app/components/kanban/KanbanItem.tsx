'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Todo } from '@/app/types';
import { updateTodo, deleteTodo } from '@/app/actions/todoActions';

interface KanbanItemProps {
  todo: Todo;
  isSelected?: boolean;
}

export const KanbanItem: React.FC<KanbanItemProps> = ({ todo, isSelected = false }) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 次のステータスに更新する処理
  const handleMoveToNextStatus = async () => {
    const statusFlow: Todo['status'][] = ['todo', 'in-progress', 'done'];
    const currentIndex = statusFlow.indexOf(todo.status);
    
    // すでに完了状態の場合は何もしない
    if (currentIndex === statusFlow.length - 1) return;
    
    const nextStatus = statusFlow[currentIndex + 1];
    setIsUpdating(true);
    
    try {
      await updateTodo(todo.id, { status: nextStatus });
      router.refresh();
    } catch (error) {
      console.error('Failed to update todo status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (window.confirm('本当にこのタスクを削除しますか？')) {
      setIsDeleting(true);
      
      try {
        await deleteTodo(todo.id);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete todo:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 優先度に応じたスタイルを定義
  const priorityClasses = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  const priorityText = {
    high: '高',
    medium: '中',
    low: '低',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-3 border-l-4 ${
      isSelected
        ? 'border-indigo-500 dark:border-indigo-400'
        : 'border-transparent'
    }`}>
      <div className="flex justify-between">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-1 break-all">
          <Link href={`/kanban?id=${todo.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {todo.title}
          </Link>
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClasses[todo.priority]}`}>
          {priorityText[todo.priority]}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {todo.description || '説明はありません'}
      </p>

      <div className="flex justify-between items-center">
        {todo.status !== 'done' ? (
          <button
            onClick={handleMoveToNextStatus}
            disabled={isUpdating}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isUpdating ? (
              <svg className="w-3 h-3 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            )}
            {todo.status === 'todo' ? '進行中へ' : '完了へ'}
          </button>
        ) : (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">完了済み</span>
        )}

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
        >
          {isDeleting ? (
            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}; 