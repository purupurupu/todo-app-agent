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
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-h-[500px] rounded-lg shadow-md ${column.color} p-4`}
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
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                タスクがありません
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