'use client';

import React from 'react';
import { KanbanBoard } from './KanbanBoard';
import { Todo, TodoFormData } from '../types';
import { updateTodo, deleteTodo, batchUpdateTodos } from '../actions/todoActions';
import { useOptimisticTodos } from '../hooks/useOptimisticTodos';

interface KanbanBoardClientProps {
  initialTodos: Todo[];
}

export const KanbanBoardClient: React.FC<KanbanBoardClientProps> = ({ initialTodos }) => {
  const { 
    todos, 
    isLoading, 
    optimisticUpdateTodo, 
    optimisticDeleteTodo, 
    optimisticToggleComplete,
    optimisticChangeStatus,
  } = useOptimisticTodos(initialTodos);

  const handleUpdateTodo = async (id: string, data: Partial<TodoFormData>) => {
    try {
      // オプティミスティックUIの更新
      optimisticUpdateTodo(id, data);
      // サーバーアクションの実行
      await updateTodo(id, data);
    } catch (error) {
      console.error('Todo更新エラー:', error);
      // エラー処理
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      // オプティミスティックUIの更新
      optimisticDeleteTodo(id);
      // サーバーアクションの実行
      await deleteTodo(id);
    } catch (error) {
      console.error('Todo削除エラー:', error);
      // エラー処理
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((t: Todo) => t.id === id);
    if (!todo) return;

    try {
      // オプティミスティックUIの更新
      optimisticToggleComplete(id);
      // サーバーアクションの実行
      await updateTodo(id, { 
        completed: !todo.completed,
        status: !todo.completed ? 'done' : todo.status === 'done' ? 'todo' : todo.status
      });
    } catch (error) {
      console.error('完了ステータス更新エラー:', error);
      // エラー処理
    }
  };

  const handleChangeStatus = async (id: string, newStatus: Todo['status']) => {
    try {
      // オプティミスティックUIの更新
      optimisticChangeStatus(id, newStatus);
      // サーバーアクションの実行
      await updateTodo(id, { 
        status: newStatus,
        completed: newStatus === 'done'
      });
    } catch (error) {
      console.error('ステータス変更エラー:', error);
      // エラー処理
    }
  };

  const handleMoveTodo = async (
    updates: { id: string; status: Todo['status']; order?: number }[]
  ) => {
    try {
      // UIの更新はドラッグ＆ドロップライブラリが行うので、
      // サーバーアクションのみ実行
      await batchUpdateTodos(updates);
    } catch (error) {
      console.error('Todo移動エラー:', error);
      // エラー処理
    }
  };

  return (
    <div className="flex-1">
      <KanbanBoard
        todos={todos}
        isLoading={isLoading}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTodo}
        onUpdate={handleUpdateTodo}
        onChangeStatus={handleChangeStatus}
        onMoveTodo={handleMoveTodo}
      />
    </div>
  );
}; 