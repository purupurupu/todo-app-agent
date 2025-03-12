'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types';

interface KanbanItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const KanbanItem: React.FC<KanbanItemProps> = ({
  todo,
  onToggleComplete,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 優先度に応じたスタイル
  const priorityStyles = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-blue-500',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-grab ${
        priorityStyles[todo.priority]
      } ${todo.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleComplete(todo.id)}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 ${
              todo.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none`}
          >
            {todo.completed && (
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>
          
          <div>
            <h4 className={`font-medium text-gray-900 dark:text-white ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {todo.title}
            </h4>
            {todo.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {todo.description}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                todo.priority === 'high'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : todo.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(todo.updatedAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 