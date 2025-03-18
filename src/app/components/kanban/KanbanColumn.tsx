import React from 'react';
import { Todo } from '@/app/types';
import { KanbanItem } from './KanbanItem';

interface KanbanColumnProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  todos: Todo[];
  selectedTodoId?: string | null;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  icon,
  color,
  todos,
  selectedTodoId,
}) => {
  // 優先度でアイテムを並べ替え（高→中→低）
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder: Record<string, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
          sortedTodos.map((todo) => (
            <KanbanItem 
              key={todo.id} 
              todo={todo} 
              isSelected={selectedTodoId === todo.id}
            />
          ))
        )}
      </div>
    </div>
  );
}; 