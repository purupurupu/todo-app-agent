import React from 'react';
import { Todo } from '@/app/types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  todos: Todo[];
  selectedTodoId?: string | null;
  activeId?: string | null;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, selectedTodoId, activeId }) => {
  // ステータス別のToDo一覧を作成
  const todosByStatus: Record<Todo['status'], Todo[]> = {
    todo: [],
    'in-progress': [],
    done: [],
    backlog: []
  };

  // 各ステータスごとにToDoを振り分け
  todos.forEach((todo) => {
    todosByStatus[todo.status].push(todo);
  });

  // ステータスごとのカラムの表示設定
  const columns = [
    {
      status: 'todo' as Todo['status'],
      title: '未着手',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      icon: (
        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      status: 'in-progress' as Todo['status'],
      title: '進行中',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      icon: (
        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      ),
    },
    {
      status: 'done' as Todo['status'],
      title: '完了',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: (
        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      status: 'backlog' as Todo['status'],
      title: 'バックログ',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      icon: (
        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 px-2 sm:px-0">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          status={column.status}
          title={column.title}
          icon={column.icon}
          color={column.color}
          todos={todosByStatus[column.status]}
          selectedTodoId={selectedTodoId}
          activeId={activeId}
        />
      ))}
    </div>
  );
}; 