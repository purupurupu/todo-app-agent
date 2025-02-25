'use client';

import { TodoApp } from './components/TodoApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      <TodoApp />
    </div>
  );
}
