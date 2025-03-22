'use client';

import React, { CSSProperties, useEffect } from 'react';
import Link from 'next/link';
import { Todo } from '@/app/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanItemProps {
  todo: Todo;
  isSelected?: boolean;
  isDragging?: boolean;
  handleTaskClick?: (id: string) => void;
}

export const KanbanItem: React.FC<KanbanItemProps> = ({ todo, isSelected = false, isDragging = false, handleTaskClick }) => {
  // useSortableフックを最適化した設定で使用
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: todo.id,
    data: {
      todo
    },
    animateLayoutChanges: () => true, // レイアウト変更時のアニメーションを常に有効化
    transition: {
      duration: 250, // ミリ秒単位でのトランジション時間
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)' // よりスムーズなイージング関数
    }
  });

  // デバッグ用：ドラッグ状態の変化をログ出力
  useEffect(() => {
    if (isSortableDragging) {
      console.log(`ドラッグ中: ${todo.id} - ${todo.title}`);
    }
  }, [isSortableDragging, todo.id, todo.title]);

  // スタイルキーフレームアニメーションを適用（クライアントサイドのみ）
  useEffect(() => {
    // クライアントサイドのみで実行
    if (typeof window !== 'undefined' && !document.getElementById('kanban-item-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'kanban-item-styles';
      styleTag.textContent = `
        @keyframes pulse {
          0% { opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { opacity: 0.1; }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  // ドラッグ中のスタイル - より滑らかなトランジションを設定
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease',
    zIndex: isSortableDragging ? 999 : undefined,
    opacity: isSortableDragging ? 0.85 : undefined,
    boxShadow: isSortableDragging 
      ? '0 16px 24px rgba(0, 0, 0, 0.16), 0 6px 8px rgba(0, 0, 0, 0.1)' 
      : undefined,
    cursor: isSortableDragging ? 'grabbing' : 'grab',
    touchAction: 'none', // タッチデバイスでのドラッグ操作を改善
    willChange: 'transform, opacity', // ブラウザに変更を予告して最適化
    ...(isDragging && {
      scale: '1.02', // ドラッグ中に少し拡大してフィードバックを強化
    }),
  };

  // 優先度に応じたスタイルを定義
  const priorityClasses = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  const priorityText = {
    high: '高',
    medium: '中',
    low: '低',
  };

  // ステータスに応じたボーダーカラーを定義
  const statusBorderColors = {
    'backlog': 'border-gray-400 dark:border-gray-500',
    'todo': 'border-blue-400 dark:border-blue-500',
    'in-progress': 'border-purple-400 dark:border-purple-500',
    'done': 'border-green-400 dark:border-green-500',
  };

  const item = (
    <div 
      ref={setNodeRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-4 mb-3 
        border-l-4 ${statusBorderColors[todo.status]} 
        ${isSelected ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''} 
        ${isDragging || isSortableDragging ? 'opacity-90 scale-[1.02]' : ''} 
        cursor-grab 
        hover:bg-gray-50 dark:hover:bg-gray-700 
        transition-all duration-250 ease-out
        transform hover:-translate-y-1`}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => handleTaskClick && handleTaskClick(todo.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-1 break-all">
          <Link href={`/kanban?id=${todo.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {todo.title}
          </Link>
        </h3>
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClasses[todo.priority]}`}
          data-testid="priority-badge"
        >
          {priorityText[todo.priority]}
        </span>
      </div>
      
      {todo.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {todo.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="truncate">#{todo.id.slice(-4)}</span>
        <Link 
          href={`?id=${todo.id}`} 
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          詳細
        </Link>
      </div>
    </div>
  );

  return item;
}; 