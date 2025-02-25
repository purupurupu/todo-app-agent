import React, { useState } from 'react';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { TodoFormData } from '../types';
import { useTodos } from '../hooks/useTodos';

export const TodoApp: React.FC = () => {
  const {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodos();

  const [showConfetti, setShowConfetti] = useState(false);

  const handleAddTodo = (data: TodoFormData) => {
    addTodo(data);
  };

  const handleToggleComplete = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo && !todo.completed) {
      // タスク完了時に紙吹雪エフェクトを表示
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    toggleComplete(id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">爽快感のあるTODOアプリ</h1>
        <p className="text-gray-600">効率的にタスクを管理しましょう</p>
      </header>

      <TodoForm onSubmit={handleAddTodo} />

      <TodoList
        todos={todos}
        isLoading={isLoading}
        onToggleComplete={handleToggleComplete}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="confetti-container">
              {Array.from({ length: 100 }).map((_, i) => {
                const size = Math.random() * 10 + 5;
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 3 + 2;
                const colors = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'];
                const color = colors[Math.floor(Math.random() * colors.length)];

                return (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      position: 'absolute',
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      left: `${left}%`,
                      top: '-10px',
                      opacity: Math.random() + 0.5,
                      animation: `fall ${animationDuration}s linear forwards`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}; 