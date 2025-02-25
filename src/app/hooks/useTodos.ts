import { useState, useEffect } from 'react';
import { Todo, TodoFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ローカルストレージからTODOを読み込む
  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos);
          // 日付文字列をDateオブジェクトに変換
          const formattedTodos = parsedTodos.map((todo: Omit<Todo, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
          }));
          setTodos(formattedTodos);
        }
      } catch (error) {
        console.error('TODOの読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  // TODOの変更をローカルストレージに保存
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  // 新しいTODOを追加
  const addTodo = (todoData: TodoFormData) => {
    const now = new Date();
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    return newTodo;
  };

  // TODOを更新
  const updateTodo = (id: string, todoData: Partial<TodoFormData>) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, ...todoData, updatedAt: new Date() }
          : todo
      )
    );
  };

  // TODOを削除
  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // 完了状態を切り替え
  const toggleComplete = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  // 優先度でフィルタリングされたTODOを取得
  const getTodosByPriority = (priority: Todo['priority']) => {
    return todos.filter((todo) => todo.priority === priority);
  };

  // 完了状態でフィルタリングされたTODOを取得
  const getTodosByCompletion = (completed: boolean) => {
    return todos.filter((todo) => todo.completed === completed);
  };

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getTodosByPriority,
    getTodosByCompletion,
  };
}; 