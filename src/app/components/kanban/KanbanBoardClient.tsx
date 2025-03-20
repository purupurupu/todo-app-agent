'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOptimisticTodos } from '@/app/hooks/useOptimisticTodos';
import { KanbanBoard } from './KanbanBoard';
import { TodoForm } from '../shared/TodoForm';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Todo } from '@/app/types';
import { batchUpdateTodos } from '@/app/actions/todoActions';

interface KanbanBoardClientProps {
  initialTodos: Todo[];
}

export const KanbanBoardClient: React.FC<KanbanBoardClientProps> = ({ initialTodos }) => {
  const [showForm, setShowForm] = useState(false);
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const { todos, optimisticAddTodo, optimisticChangeStatus } = useOptimisticTodos(initialTodos);
  const [activeId, setActiveId] = useState<string | null>(null);

  // ドラッグ操作のために適切なセンサーを設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // ドラッグを開始するために必要な最小移動距離
      },
    })
  );

  // ドラッグ開始時の処理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // ドラッグ中に他のエリア上に移動した時の処理
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // アクティブなTODOを見つける
    const activeTodo = todos.find(todo => todo.id === activeId);
    // オーバーしている要素がカラムの場合（IDが文字列でtodo, in-progress, doneなど）
    const isOverColumn = ['backlog', 'todo', 'in-progress', 'done'].includes(overId);
    
    if (activeTodo && isOverColumn) {
      // オプティミスティックに状態を更新
      optimisticChangeStatus(activeId, overId as Todo['status']);
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // アクティブなTODOを見つける
    const activeTodo = todos.find(todo => todo.id === activeId);
    // オーバーしている要素がカラムの場合
    const isOverColumn = ['backlog', 'todo', 'in-progress', 'done'].includes(overId);
    
    if (activeTodo && isOverColumn && activeTodo.status !== overId) {
      try {
        // サーバーに更新を送信
        await batchUpdateTodos([{
          id: activeId,
          status: overId as Todo['status']
        }]);
      } catch (error) {
        console.error('Error updating todo status:', error);
        // エラー処理（UIに表示するなど）
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">カンバンボード</h1>
          <p className="text-gray-600 dark:text-gray-300">ステータス別にタスクを管理します</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          新しいタスク
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <TodoForm 
            onClose={() => setShowForm(false)} 
            onAddTodo={(newTodo) => {
              optimisticAddTodo(newTodo);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard todos={todos} selectedTodoId={selectedId || ''} activeId={activeId} />
      </DndContext>
    </div>
  );
};