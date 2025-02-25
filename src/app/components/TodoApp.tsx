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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-12 text-center">
        <div className="inline-block mb-4 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">爽快感のあるTODOアプリ</h1>
        <p className="text-gray-600 max-w-md mx-auto">効率的にタスクを管理し、生産性を向上させましょう。シンプルで美しいインターフェースで、タスク管理が楽しくなります。</p>
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
              {Array.from({ length: 150 }).map((_, i) => {
                const size = Math.random() * 12 + 5;
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 3 + 2;
                const colors = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7', '#7E24FA', '#F971D7', '#17C964'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = Math.random() > 0.5 ? 'circle' : 'rect';

                return (
                  <div
                    key={i}
                    className={`confetti ${shape}`}
                    style={{
                      position: 'absolute',
                      width: `${size}px`,
                      height: shape === 'circle' ? `${size}px` : `${size * 0.6}px`,
                      backgroundColor: color,
                      left: `${left}%`,
                      top: '-20px',
                      opacity: Math.random() + 0.5,
                      animation: `fall ${animationDuration}s linear forwards, spin ${animationDuration * 0.5}s linear infinite`,
                      borderRadius: shape === 'circle' ? '50%' : '2px',
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
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .confetti {
          will-change: transform, opacity;
          z-index: 9999;
        }
        .confetti.rect {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 爽快感のあるTODOアプリ</p>
        <p className="mt-1">効率的なタスク管理で、あなたの生産性を最大化</p>
      </footer>
    </div>
  );
}; 