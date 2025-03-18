import React from 'react';
import { Todo } from '@/app/types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  selectedTodoId?: string | null;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, selectedTodoId }) => {
  // 優先度でToDoを並べ替え（高→中→低）
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder: Record<string, number> = {
      HIGH: 0,
      MEDIUM: 1,
      LOW: 2,
    };
    
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (todos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">タスク一覧（{todos.length}件）</h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedTodos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            isSelected={selectedTodoId === todo.id}
          />
        ))}
      </ul>
    </div>
  );
}; 