import { useState, useEffect } from 'react';
import { Todo, TodoFormData, KanbanColumn } from '../types';
import { v4 as uuidv4 } from 'uuid';

// カンバンボードの列定義
export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'バックログ',
    status: 'backlog',
    color: 'bg-gray-200 dark:bg-gray-700',
  },
  {
    id: 'todo',
    title: 'TODO',
    status: 'todo',
    color: 'bg-blue-200 dark:bg-blue-900',
  },
  {
    id: 'in-progress',
    title: '進行中',
    status: 'in-progress',
    color: 'bg-yellow-200 dark:bg-yellow-900',
  },
  {
    id: 'done',
    title: '完了',
    status: 'done',
    color: 'bg-green-200 dark:bg-green-900',
  },
];

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
            // 古いデータにステータスがない場合はデフォルト値を設定
            status: todo.status || (todo.completed ? 'done' : 'todo'),
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
      // ステータスが指定されていない場合はデフォルト値を設定
      status: todoData.status || 'todo',
      // 同じステータスの最後に追加するための順序を計算
      order: getMaxOrderForStatus(todoData.status || 'todo') + 1,
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
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const completed = !todo.completed;
          // 完了状態に応じてステータスも更新
          const status = completed ? 'done' : todo.status === 'done' ? 'todo' : todo.status;
          return { 
            ...todo, 
            completed, 
            status,
            updatedAt: new Date() 
          };
        }
        return todo;
      })
    );
  };

  // タスクのステータスを変更
  const changeStatus = (id: string, newStatus: Todo['status']) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          // 完了ステータスに移動した場合は完了フラグも更新
          const completed = newStatus === 'done';
          return { 
            ...todo, 
            status: newStatus, 
            completed,
            updatedAt: new Date(),
            // 新しいステータスの最後に追加するための順序を計算
            order: getMaxOrderForStatus(newStatus) + 1,
          };
        }
        return todo;
      });
      return updatedTodos;
    });
  };

  // タスクの順序を変更（ドラッグ＆ドロップ）
  const moveTodo = (id: string, newStatus: Todo['status'], newIndex: number) => {
    setTodos((prevTodos) => {
      // 移動するタスクを取得
      const todoToMove = prevTodos.find((todo) => todo.id === id);
      if (!todoToMove) return prevTodos;

      // 移動先のステータスのタスクを取得し、順序でソート
      const statusTodos = prevTodos
        .filter((todo) => todo.status === newStatus && todo.id !== id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // 新しい順序を計算
      let newOrder = 0;
      if (newIndex === 0) {
        // 先頭に移動する場合
        newOrder = statusTodos.length > 0 ? (statusTodos[0].order || 0) - 1 : 0;
      } else if (newIndex >= statusTodos.length) {
        // 末尾に移動する場合
        newOrder = statusTodos.length > 0 ? (statusTodos[statusTodos.length - 1].order || 0) + 1 : 0;
      } else {
        // 中間に移動する場合
        const prevOrder = statusTodos[newIndex - 1].order || 0;
        const nextOrder = statusTodos[newIndex].order || 0;
        newOrder = (prevOrder + nextOrder) / 2;
      }

      // タスクを更新
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          // 完了ステータスに移動した場合は完了フラグも更新
          const completed = newStatus === 'done';
          return {
            ...todo,
            status: newStatus,
            completed,
            order: newOrder,
            updatedAt: new Date(),
          };
        }
        return todo;
      });
    });
  };

  // 特定のステータスの最大順序を取得
  const getMaxOrderForStatus = (status: Todo['status']) => {
    const statusTodos = todos.filter((todo) => todo.status === status);
    if (statusTodos.length === 0) return 0;
    return Math.max(...statusTodos.map((todo) => todo.order || 0));
  };

  // ステータスでフィルタリングされたTODOを取得
  const getTodosByStatus = (status: Todo['status']) => {
    return todos
      .filter((todo) => todo.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
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
    changeStatus,
    moveTodo,
    getTodosByStatus,
    getTodosByPriority,
    getTodosByCompletion,
  };
}; 