import { useState, useEffect } from 'react';
import { Todo, TodoFormData, KanbanColumn } from '../types';

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
  const [error, setError] = useState<string | null>(null);

  // APIからTODOを読み込む
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('TODOの取得に失敗しました');
      }
      const data = await response.json();
      // 日付文字列をDateオブジェクトに変換
      const formattedTodos = data.todos.map((todo: Omit<Todo, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
      setTodos(formattedTodos);
    } catch (error) {
      console.error('TODOの読み込みに失敗しました:', error);
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    fetchTodos();
  }, []);

  // 新しいTODOを追加
  const addTodo = async (todoData: TodoFormData) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      
      if (!response.ok) {
        throw new Error('TODOの追加に失敗しました');
      }
      
      const data = await response.json();
      const newTodo = {
        ...data.todo,
        createdAt: new Date(data.todo.createdAt),
        updatedAt: new Date(data.todo.updatedAt),
      };
      
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      return newTodo;
    } catch (error) {
      console.error('TODOの追加に失敗しました:', error);
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
      return null;
    }
  };

  // TODOを更新
  const updateTodo = async (id: string, todoData: Partial<TodoFormData>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      
      if (!response.ok) {
        throw new Error('TODOの更新に失敗しました');
      }
      
      const data = await response.json();
      const updatedTodo = {
        ...data.todo,
        createdAt: new Date(data.todo.createdAt),
        updatedAt: new Date(data.todo.updatedAt),
      };
      
      // 注意: オプティミスティックUIを実装している関数からは、
      // すでにローカルの状態が更新されているため、ここでの更新は
      // APIからの最新データで上書きするだけになります
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
      
      return updatedTodo;
    } catch (error) {
      console.error('TODOの更新に失敗しました:', error);
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
      throw error; // エラーを再スローして呼び出し元でキャッチできるようにする
    }
  };

  // TODOを削除
  const deleteTodo = async (id: string) => {
    // 削除前のTODOを保存
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;
    
    // オプティミスティックUI: 先にローカルの状態を更新
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('TODOの削除に失敗しました');
      }
    } catch (error) {
      // エラーが発生した場合は元の状態に戻す
      console.error('TODOの削除に失敗しました:', error);
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
      
      // 削除に失敗した場合は元に戻す
      if (todoToDelete) {
        setTodos((prevTodos) => [...prevTodos, todoToDelete]);
      }
    }
  };

  // 完了状態を切り替え
  const toggleComplete = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    
    const completed = !todo.completed;
    // 完了状態に応じてステータスも更新
    const status = completed ? 'done' : todo.status === 'done' ? 'todo' : todo.status;
    
    // オプティミスティックUI: 先にローカルの状態を更新
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id
          ? {
              ...t,
              completed,
              status,
              updatedAt: new Date(),
            }
          : t
      )
    );
    
    // その後APIリクエストを送信
    try {
      await updateTodo(id, { completed, status });
    } catch (error) {
      // エラーが発生した場合は元の状態に戻す
      console.error('完了状態の切り替えに失敗しました:', error);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === id ? todo : t))
      );
    }
  };

  // タスクのステータスを変更
  const changeStatus = async (id: string, newStatus: Todo['status']) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    
    // 完了ステータスに移動した場合は完了フラグも更新
    const completed = newStatus === 'done';
    
    // 新しいステータスの最後に追加するための順序を計算
    const newOrder = getMaxOrderForStatus(newStatus) + 1;
    
    // オプティミスティックUI: 先にローカルの状態を更新
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              completed,
              order: newOrder,
              updatedAt: new Date(),
            }
          : t
      )
    );
    
    // その後APIリクエストを送信
    try {
      await updateTodo(id, { 
        status: newStatus, 
        completed,
        order: newOrder,
      });
    } catch (error) {
      // エラーが発生した場合は元の状態に戻す
      console.error('ステータス変更に失敗しました:', error);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === id ? todo : t))
      );
    }
  };

  // 複数のタスクを一括更新（ドラッグ＆ドロップ後など）
  const batchUpdateTodos = async (updatedTodos: { id: string; status: Todo['status']; order?: number }[]) => {
    try {
      const response = await fetch('/api/todos/batch-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos: updatedTodos }),
      });
      
      if (!response.ok) {
        throw new Error('TODOの一括更新に失敗しました');
      }
      
      const data = await response.json();
      const updatedTodoList = data.todos.map((todo: Omit<Todo, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
      
      // 更新されたTODOをステートに反映
      setTodos((prevTodos) => {
        const todoMap = new Map<string, Todo>(updatedTodoList.map((todo: Omit<Todo, 'createdAt' | 'updatedAt'> & { createdAt: Date; updatedAt: Date }) => [todo.id, todo as Todo]));
        return prevTodos.map((todo) => todoMap.get(todo.id) || todo);
      });
    } catch (error) {
      console.error('TODOの一括更新に失敗しました:', error);
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    }
  };

  // タスクの順序を変更（ドラッグ＆ドロップ）
  const moveTodo = async (id: string, newStatus: Todo['status'], newIndex: number) => {
    // 移動するタスクを取得
    const todoToMove = todos.find((todo) => todo.id === id);
    if (!todoToMove) return;

    // 移動先のステータスのタスクを取得し、順序でソート
    const statusTodos = todos
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

    // 完了ステータスに移動した場合は完了フラグも更新
    const completed = newStatus === 'done';
    
    // オプティミスティックUI: 先にローカルの状態を更新
    setTodos((prevTodos) => 
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            status: newStatus,
            completed,
            order: newOrder,
            updatedAt: new Date(),
          };
        }
        return todo;
      })
    );
    
    // その後APIリクエストを送信
    try {
      // 一括更新APIを使用して更新
      await batchUpdateTodos([
        { 
          id, 
          status: newStatus, 
          order: newOrder 
        }
      ]);
    } catch (error) {
      // エラーが発生した場合は元の状態に戻す
      console.error('タスクの移動に失敗しました:', error);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === id ? todoToMove : t))
      );
    }
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
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    changeStatus,
    moveTodo,
    batchUpdateTodos,
    getTodosByStatus,
    getTodosByPriority,
    getTodosByCompletion,
  };
}; 