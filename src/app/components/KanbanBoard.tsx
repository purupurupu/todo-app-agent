'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanItem } from './KanbanItem';
import { Todo } from '../types/index';
import { KANBAN_COLUMNS } from '../hooks/useTodos';

interface KanbanBoardProps {
  todos: Todo[];
  isLoading: boolean;
  onChangeStatus: (id: string, status: Todo['status']) => void;
  onMoveTodo: (id: string, status: Todo['status'], index: number) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  isLoading,
  onChangeStatus,
  onMoveTodo,
  onToggleComplete,
  onDelete,
  onUpdate
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // ドラッグ中のアイテム
  const activeTodo = activeId ? todos.find(todo => todo.id === activeId) : null;
  
  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグ開始時の処理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // ドラッグ中の処理
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // 同じアイテムの場合は何もしない
    if (activeId === overId) return;
    
    // アクティブなアイテムとオーバーしているアイテムを取得
    const activeTodo = todos.find(todo => todo.id === activeId);
    const overTodo = todos.find(todo => todo.id === overId);
    
    // 列へのドロップの場合
    if (!overTodo && KANBAN_COLUMNS.some(col => col.id === overId)) {
      const newStatus = overId as Todo['status'];
      if (activeTodo && activeTodo.status !== newStatus) {
        onChangeStatus(activeId, newStatus);
      }
      return;
    }
    
    // アイテム間のドラッグの場合
    if (activeTodo && overTodo) {
      // 異なる列間のドラッグの場合
      if (activeTodo.status !== overTodo.status) {
        const statusTodos = todos
          .filter(todo => todo.status === overTodo.status)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        const overIndex = statusTodos.findIndex(todo => todo.id === overId);
        onMoveTodo(activeId, overTodo.status, overIndex);
      }
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // 同じアイテムの場合は何もしない
    if (activeId === overId) {
      setActiveId(null);
      return;
    }
    
    // アクティブなアイテムとオーバーしているアイテムを取得
    const activeTodo = todos.find(todo => todo.id === activeId);
    const overTodo = todos.find(todo => todo.id === overId);
    
    // 列へのドロップの場合
    if (!overTodo && KANBAN_COLUMNS.some(col => col.id === overId)) {
      const newStatus = overId as Todo['status'];
      if (activeTodo && activeTodo.status !== newStatus) {
        onChangeStatus(activeId, newStatus);
      }
      setActiveId(null);
      return;
    }
    
    // 同じ列内でのドラッグの場合
    if (activeTodo && overTodo && activeTodo.status === overTodo.status) {
      const statusTodos = todos
        .filter(todo => todo.status === activeTodo.status)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const activeIndex = statusTodos.findIndex(todo => todo.id === activeId);
      const overIndex = statusTodos.findIndex(todo => todo.id === overId);
      
      if (activeIndex !== overIndex) {
        onMoveTodo(activeId, activeTodo.status, overIndex);
      }
    }
    
    setActiveId(null);
  };

  // ステータスごとのTODOを取得
  const getTodosByStatus = (status: Todo['status']) => {
    return todos
      .filter(todo => todo.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              todos={getTodosByStatus(column.status)}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && activeTodo ? (
            <div className="opacity-80">
              <KanbanItem
                todo={activeTodo}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}; 