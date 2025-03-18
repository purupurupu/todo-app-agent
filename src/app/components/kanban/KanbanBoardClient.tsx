'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Todo } from '@/app/types';
import { KanbanBoard } from './KanbanBoard';
import { TodoForm } from '../shared/TodoForm';
import { useOptimisticTodos } from '@/app/hooks/useOptimisticTodos';

interface KanbanBoardClientProps {
  initialTodos: Todo[];
}

export const KanbanBoardClient: React.FC<KanbanBoardClientProps> = ({ initialTodos }) => {
  const [showForm, setShowForm] = useState(false);
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const { todos, addOptimisticTodo } = useOptimisticTodos(initialTodos);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">カンバンボード</h1>
          <p className="text-gray-600 dark:text-gray-300">ステータス別にタスクを管理します</p>
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

      <KanbanBoard 
        todos={todos} 
        selectedTodoId={selectedId}
      />
    </div>
  );
};