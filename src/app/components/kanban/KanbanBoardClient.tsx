'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOptimisticTodos } from '@/app/hooks/useOptimisticTodos';
import { KanbanBoard } from './KanbanBoard';
import { TodoForm } from '../shared/TodoForm';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent, 
  useSensor, 
  useSensors,
  closestCorners,
  pointerWithin,
  rectIntersection,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  CollisionDetection
} from '@dnd-kit/core';
import { 
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { Todo } from '@/app/types';
import { batchUpdateTodos } from '@/app/actions/todoActions';
import { KanbanItem } from './KanbanItem';

interface KanbanBoardClientProps {
  initialTodos: Todo[];
}

export const KanbanBoardClient: React.FC<KanbanBoardClientProps> = ({ initialTodos }) => {
  const [showForm, setShowForm] = useState(false);
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const { todos, optimisticAddTodo, optimisticChangeStatus, setTodos } = useOptimisticTodos(initialTodos);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  // ドラッグ操作のために適切なセンサーを設定 - より正確に反応するセンサー設定
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // マウスセンサーの反応性を向上
      activationConstraint: {
        distance: 3, // ドラッグを開始するために必要な最小移動距離を小さく設定
        delay: 50, // 短い遅延でドラッグ開始
        tolerance: 5, // 許容範囲を広めに設定
      },
    }),
    useSensor(TouchSensor, {
      // タッチセンサーの品質を向上
      activationConstraint: {
        delay: 100, // モバイルでの遅延
        tolerance: 10, // タッチ操作の許容範囲を広く
      },
    }),
    useSensor(KeyboardSensor, {
      // キーボード操作もサポート
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // よりロバストな衝突検出の組み合わせ
  const customCollisionDetection: CollisionDetection = (args) => {
    // まずアイテムが領域内にあるかチェック（基本的な検出）
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    
    // 次に領域の交差をチェック（より詳細な検出）
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }
    
    // 最後にclosestCornersで最も近い要素を検出（フォールバック）
    return closestCorners(args);
  };

  // ドラッグ開始時の処理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    setActiveId(id);
    
    // ドラッグ中のアイテムデータを保存
    const draggedTodo = todos.find(todo => todo.id === id);
    if (draggedTodo) {
      setActiveTodo(draggedTodo);
      console.log('ドラッグ開始:', id, draggedTodo.status);
    }
  };

  // ドラッグ中に他のエリア上に移動した時の処理
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // アクティブなTODOを見つける
    const activeTodo = todos.find(todo => todo.id === activeId);
    
    if (!activeTodo) return;
    
    // ドラッグ中の詳細なデバッグ情報
    console.log('ドラッグオーバー:', { 
      activeId, 
      overId, 
      activeData: active.data.current,
      overData: over.data.current
    });
    
    // オーバーしている要素がカラムの場合（IDが文字列でtodo, in-progress, doneなど）
    const isOverColumn = ['backlog', 'todo', 'in-progress', 'done'].includes(overId);
    
    if (activeTodo && isOverColumn && activeTodo.status !== overId) {
      // 別のカラムに移動する場合は、ステータスを変更
      console.log(`カラム移動: ${activeTodo.status} -> ${overId}`);
      optimisticChangeStatus(activeId, overId as Todo['status']);
      return;
    }
    
    // 同じカラム内でのドラッグの場合（アイテム間でのドラッグ）
    if (activeTodo && !isOverColumn && activeId !== overId) {
      const overTodo = todos.find(todo => todo.id === overId);
      
      if (overTodo && activeTodo.status === overTodo.status) {
        console.log(`同じカラム内での並べ替え: ${activeTodo.status}`);
        // 同じステータスのアイテム間でのドラッグ
        setTodos(prevTodos => {
          // 同じステータスの項目だけフィルタリング
          const filteredTodos = prevTodos.filter(todo => todo.status === activeTodo.status);
          
          // 現在の配列内でのインデックスを検索
          const activeIndex = filteredTodos.findIndex(todo => todo.id === activeId);
          const overIndex = filteredTodos.findIndex(todo => todo.id === overId);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            // 配列内で項目を移動
            const newFilteredTodos = arrayMove(filteredTodos, activeIndex, overIndex);
            
            // 順序番号を更新
            const updatedFilteredTodos = newFilteredTodos.map((todo, index) => ({
              ...todo,
              order: index
            }));
            
            // 元の配列から同じステータスの項目を除外し、並び替えた項目を追加
            return [
              ...prevTodos.filter(todo => todo.status !== activeTodo.status),
              ...updatedFilteredTodos
            ];
          }
          
          return prevTodos;
        });
      }
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // 状態をリセット
    setActiveId(null);
    setActiveTodo(null);
    
    if (!over) {
      console.log('ドラッグキャンセル: オーバー要素なし');
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    console.log('ドラッグ終了:', { 
      activeId, 
      overId,
      activeData: active.data.current,
      overData: over.data.current
    });
    
    // アクティブなTODOを見つける
    const activeTodo = todos.find(todo => todo.id === activeId);
    
    if (!activeTodo) return;
    
    // オーバーしている要素がカラムの場合
    const isOverColumn = ['backlog', 'todo', 'in-progress', 'done'].includes(overId);
    
    try {
      if (isOverColumn && activeTodo.status !== overId) {
        // 別のカラムに移動する場合
        console.log(`カラム間移動を確定: ${activeTodo.status} -> ${overId}`);
        await batchUpdateTodos([{
          id: activeId,
          status: overId as Todo['status']
        }]);
      } else if (!isOverColumn && activeId !== overId) {
        // 同じカラム内での順序変更の場合
        const overTodo = todos.find(todo => todo.id === overId);
        
        if (overTodo && activeTodo.status === overTodo.status) {
          console.log(`同じカラム内の順序変更を確定: ${activeTodo.status}`);
          // 同じステータスのアイテムだけを抽出し、順序を更新
          const sameStatusTodos = todos
            .filter(todo => todo.status === activeTodo.status)
            .map((todo, index) => ({
              id: todo.id,
              order: index,
              status: todo.status
            }));
          
          // 一括更新
          await batchUpdateTodos(sameStatusTodos);
        }
      }
    } catch (error) {
      console.error('Error updating todos:', error);
      // エラー処理
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
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        autoScroll={{
          enabled: true,
          threshold: {
            x: 0.1,
            y: 0.1
          }
        }}
      >
        <KanbanBoard todos={todos} selectedTodoId={selectedId || ''} activeId={activeId} />
        
        {/* ドラッグ中のオーバーレイ表示 */}
        <DragOverlay adjustScale={true}>
          {activeTodo ? (
            <KanbanItem 
              todo={activeTodo}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};