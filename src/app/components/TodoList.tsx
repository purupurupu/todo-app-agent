import React, { useState } from 'react';
import { Todo, TodoFormData } from '../types';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<TodoFormData>) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isLoading,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Todo['priority']>('all');

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = (data: TodoFormData) => {
    if (editingId) {
      onUpdate(editingId, data);
      setEditingId(null);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    // 完了状態フィルター
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    
    // 優先度フィルター
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    
    return true;
  });

  // 優先度順にソート（高→中→低）
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="relative">
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              ステータス
            </label>
            <div className="relative">
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                <option value="all">すべて</option>
                <option value="active">未完了</option>
                <option value="completed">完了済み</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              優先度
            </label>
            <div className="relative">
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | Todo['priority'])}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                <option value="all">すべて</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="ml-auto flex items-end">
            <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
              {filteredTodos.length} 件表示 / 全 {todos.length} 件
            </span>
          </div>
        </div>
      </div>

      {sortedTodos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">タスクがありません</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">新しいタスクを追加して、効率的に作業を管理しましょう！</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTodos.map((todo) =>
            editingId === todo.id ? (
              <div key={todo.id} className="mb-4 animate-fadeIn">
                <TodoForm
                  onSubmit={handleUpdate}
                  initialData={todo}
                  isEditing={true}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              <div key={todo.id} className="animate-fadeIn">
                <TodoItem
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={handleEdit}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}; 