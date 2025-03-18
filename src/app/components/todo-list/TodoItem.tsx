'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Todo } from '@/app/types';
import { updateTodo, deleteTodo } from '@/app/actions/todoActions';
import { TodoForm } from '../shared/TodoForm';

interface TodoItemProps {
  todo: Todo;
  isSelected?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isSelected = false }) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Todo['status'];
    setIsUpdatingStatus(true);
    
    try {
      await updateTodo(todo.id, { status: newStatus });
      router.refresh();
    } catch (error) {
      console.error('Failed to update todo status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const statusText = {
    todo: '未着手',
    'in-progress': '進行中',
    done: '完了',
    backlog: 'バックログ'
  };

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
    <li className={`border-l-4 ${
      isSelected
        ? 'border-indigo-500 dark:border-indigo-400'
        : 'border-transparent'
    }`}>
      <div className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-5 sm:px-6">
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <TodoForm 
              todo={todo} 
              onClose={() => setShowForm(false)} 
              onUpdateTodo={() => {
                setShowForm(false);
                router.refresh();
              }}
            />
          </div>
        ) : (
          <div className="flex items-start justify-between flex-wrap md:flex-nowrap gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white break-all pr-2">{todo.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClasses[todo.priority]}`}>
                  {priorityText[todo.priority]}
                </span>
              </div>
              
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-words">
                {todo.description || '説明はありません'}
              </div>
              
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">ステータス:</span>
                  <select
                    value={todo.status}
                    onChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  >
                    <option value="todo">未着手</option>
                    <option value="in-progress">進行中</option>
                    <option value="done">完了</option>
                    <option value="backlog">バックログ</option>
                  </select>
                  {isUpdatingStatus && (
                    <svg className="w-4 h-4 ml-2 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                編集
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? (
                  <svg className="w-4 h-4 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                )}
                削除
              </button>

              <Link 
                href={`/list?id=${todo.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                詳細
              </Link>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}; 