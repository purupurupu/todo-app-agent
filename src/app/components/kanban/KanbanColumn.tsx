'use client';

import React from 'react';
import { Todo } from '@/app/types';
import { KanbanItem } from './KanbanItem';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  todos: Todo[];
  selectedTodoId?: string | null;
  activeId?: string | null;
  status: Todo['status'];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  icon,
  color,
  todos,
  selectedTodoId,
  activeId,
  status,
}) => {
  // ドロップ可能な領域として設定 - 改善されたドロップオプション
  const { isOver, setNodeRef, active } = useDroppable({
    id: status,
    data: {
      type: 'column',
      accepts: ['todo'],
      status
    }
  });

  // ドラッグオーバー時のスタイルを追加
  const dropStyle = isOver 
    ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-indigo-500 dark:ring-indigo-400 transform scale-[1.01]' 
    : '';

  // トランクアイテムを優先度とorder値でソート
  const sortedTodos = [...todos].sort((a, b) => {
    // まずorder値でソート（null値は最後に）
    if (a.order !== null && b.order !== null) {
      return a.order - b.order;
    } else if (a.order !== null) {
      return -1;
    } else if (b.order !== null) {
      return 1;
    }
    
    // order値がない場合は優先度でソート
    const priorityOrder: Record<string, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // ドラッグ&ドロップのためのアイテムIDリスト
  const todoIds = sortedTodos.map(todo => todo.id);

  // ステータスに応じたボーダーカラーを定義
  const statusColors = {
    'backlog': 'border-gray-400 dark:border-gray-500',
    'todo': 'border-blue-400 dark:border-blue-500',
    'in-progress': 'border-purple-400 dark:border-purple-500',
    'done': 'border-green-400 dark:border-green-500',
  };

  // アクティブなドラッグ操作があるかどうか
  const hasActiveDrag = !!active;

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
        transition-all duration-200 ${dropStyle} border-t-4 ${statusColors[status]}
        ${hasActiveDrag ? 'min-h-[150px]' : ''}`}
    >
      <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center`}>
        <div className={`inline-flex items-center rounded-full p-1.5 ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2 flex items-center">
          {title} 
          <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-2 py-0.5 rounded-full">
            {todos.length}
          </span>
        </h3>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
        {sortedTodos.length === 0 ? (
          <div className={`text-center py-6 px-4 border-2 border-dashed 
            ${isOver ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'} 
            rounded-lg transition-colors duration-200`}>
            <p className="text-gray-500 dark:text-gray-400">タスクがありません</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">タスクをここにドラッグ＆ドロップ</p>
          </div>
        ) : (
          <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
            {sortedTodos.map((todo) => (
              <KanbanItem 
                key={todo.id} 
                todo={todo} 
                isSelected={selectedTodoId === todo.id}
                isDragging={activeId === todo.id}
              />
            ))}
          </SortableContext>
        )}
        
        {/* ドラッグ中で空の場合のドロップヒント領域を表示 */}
        {hasActiveDrag && sortedTodos.length > 0 && (
          <div className={`mt-3 text-center py-4 px-3 border-2 border-dashed 
            ${isOver ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'} 
            rounded-lg transition-colors duration-200 opacity-70`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">タスクをここにドロップ</p>
          </div>
        )}
      </div>
    </div>
  );
}; 