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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2 md:gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">すべて</option>
              <option value="active">未完了</option>
              <option value="completed">完了済み</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | Todo['priority'])}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div className="ml-auto flex items-end">
            <span className="text-sm text-gray-600">
              {filteredTodos.length} 件表示 / 全 {todos.length} 件
            </span>
          </div>
        </div>
      </div>

      {sortedTodos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
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
          <p className="text-gray-600">タスクがありません</p>
          <p className="text-sm text-gray-500 mt-1">新しいタスクを追加してみましょう！</p>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedTodos.map((todo) =>
            editingId === todo.id ? (
              <div key={todo.id} className="mb-3">
                <TodoForm
                  onSubmit={handleUpdate}
                  initialData={todo}
                  isEditing={true}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={handleEdit}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}; 