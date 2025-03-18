'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanItem } from './KanbanItem';
import { Todo, KanbanColumn as KanbanColumnType } from '../types/index';

interface KanbanColumnProps {
  column: KanbanColumnType;
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  todos,
  onToggleComplete,
  onDelete,
  onUpdate
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      status: column.status
    }
  });

  // ドロップ中のハイライトスタイル
  const dropStyle = isOver ? 'ring-4 ring-inset ring-indigo-500 dark:ring-indigo-400 bg-opacity-70 dark:bg-opacity-70 shadow-lg' : '';

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-h-[500px] rounded-lg shadow-md ${column.color} p-4 transition-all duration-200 ${dropStyle}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{column.title}</h3>
        <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm px-2 py-1 rounded-full">
          {todos.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <SortableContext
          items={todos.map(todo => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400 italic min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p>タスクをここにドロップ</p>
              </div>
            ) : (
              todos.map(todo => (
                <KanbanItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}; 