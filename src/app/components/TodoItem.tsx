import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const formattedDate = new Date(todo.updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`p-4 mb-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg ${todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(todo.id)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
            aria-label={todo.completed ? 'タスク未完了に戻す' : 'タスク完了にする'}
          >
            {todo.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <div className="flex items-center mt-2 space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                {todo.priority === 'low' ? '低' : todo.priority === 'medium' ? '中' : '高'}
              </span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(todo.id)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
            aria-label="編集"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
            aria-label="削除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 