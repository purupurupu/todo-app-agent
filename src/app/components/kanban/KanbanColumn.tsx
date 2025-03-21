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
  // ドロップ可能な領域として設定
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  // ドラッグオーバー時のスタイルを追加
  const dropStyle = isOver ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-inset ring-indigo-500' : '';

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

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200 ${dropStyle}`}
    >
      <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center`}>
        <div className={`inline-flex items-center rounded-full p-1.5 ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white ml-2">
          {title} ({todos.length})
        </h3>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">タスクがありません</p>
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
      </div>
    </div>
  );
}; 