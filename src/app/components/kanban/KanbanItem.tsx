'use client';

import React from 'react';
import Link from 'next/link';
import { Todo } from '@/app/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanItemProps {
  todo: Todo;
  isSelected?: boolean;
  isDragging?: boolean;
}

export const KanbanItem: React.FC<KanbanItemProps> = ({ todo, isSelected = false, isDragging = false }) => {
  // ソート可能なアイテムとして設定
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: todo.id,
    data: {
      todo
    }
  });

  // ドラッグ中のスタイル
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isSortableDragging ? 999 : undefined,
    opacity: isSortableDragging ? 0.8 : undefined,
    boxShadow: isSortableDragging ? '0 8px 16px rgba(0, 0, 0, 0.1)' : undefined,
    cursor: isSortableDragging ? 'grabbing' : 'grab'
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
    <div 
      ref={setNodeRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-3 border-l-4 ${
        isSelected
          ? 'border-indigo-500 dark:border-indigo-400'
          : 'border-transparent'
      } ${isDragging || isSortableDragging ? 'opacity-50' : ''} cursor-grab hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
      style={style}
      {...attributes}
      {...listeners}
    >
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
    </div>
  );
}; 