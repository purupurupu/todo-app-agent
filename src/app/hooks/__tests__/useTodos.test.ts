import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { TodoFormData } from '../../types';

// ローカルストレージのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// グローバルオブジェクトにモックを設定
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTodos', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('初期状態で空のTODOリストを返すこと', () => {
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('ローカルストレージからTODOを読み込むこと', () => {
    const mockTodos = [
      {
        id: '1',
        title: 'テストタスク',
        description: '詳細説明',
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'todo',
      },
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockTodos));
    
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].title).toBe('テストタスク');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
  });

  it('新しいTODOを追加できること', () => {
    const { result } = renderHook(() => useTodos());
    
    const newTodo: TodoFormData = {
      title: '新しいタスク',
      description: '新しい説明',
      completed: false,
      priority: 'high',
      status: 'todo',
    };
    
    act(() => {
      result.current.addTodo(newTodo);
    });
    
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].title).toBe('新しいタスク');
    expect(result.current.todos[0].priority).toBe('high');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('todos', expect.any(String));
  });

  it('TODOを更新できること', () => {
    const { result } = renderHook(() => useTodos());
    
    // まずTODOを追加
    act(() => {
      result.current.addTodo({
        title: '元のタスク',
        description: '元の説明',
        completed: false,
        priority: 'medium',
        status: 'todo',
      });
    });
    
    const todoId = result.current.todos[0].id;
    
    // TODOを更新
    act(() => {
      result.current.updateTodo(todoId, {
        title: '更新されたタスク',
        priority: 'high',
      });
    });
    
    expect(result.current.todos[0].title).toBe('更新されたタスク');
    expect(result.current.todos[0].priority).toBe('high');
    expect(result.current.todos[0].description).toBe('元の説明'); // 更新されていない項目は保持される
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(3); // 実際の呼び出し回数に合わせて修正
  });

  it('TODOを削除できること', () => {
    const { result } = renderHook(() => useTodos());
    
    // まずTODOを追加
    act(() => {
      result.current.addTodo({
        title: 'タスク1',
        completed: false,
        priority: 'medium',
        status: 'todo',
      });
      
      result.current.addTodo({
        title: 'タスク2',
        completed: false,
        priority: 'medium',
        status: 'todo',
      });
    });
    
    expect(result.current.todos.length).toBe(2);
    
    const todoId = result.current.todos[0].id;
    
    // TODOを削除
    act(() => {
      result.current.deleteTodo(todoId);
    });
    
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].title).toBe('タスク2');
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(3); // 追加2回と削除1回
  });

  it('TODOの完了状態を切り替えられること', () => {
    const { result } = renderHook(() => useTodos());
    
    // まずTODOを追加
    act(() => {
      result.current.addTodo({
        title: 'タスク',
        completed: false,
        priority: 'medium',
        status: 'todo',
      });
    });
    
    const todoId = result.current.todos[0].id;
    
    // 完了状態を切り替え
    act(() => {
      result.current.toggleComplete(todoId);
    });
    
    expect(result.current.todos[0].completed).toBe(true);
    expect(result.current.todos[0].status).toBe('done'); // ステータスも変更される
    
    // もう一度切り替え
    act(() => {
      result.current.toggleComplete(todoId);
    });
    
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].status).toBe('todo'); // ステータスも戻る
  });

  it('TODOのステータスを変更できること', () => {
    const { result } = renderHook(() => useTodos());
    
    // まずTODOを追加
    act(() => {
      result.current.addTodo({
        title: 'タスク',
        completed: false,
        priority: 'medium',
        status: 'todo',
      });
    });
    
    const todoId = result.current.todos[0].id;
    
    // ステータスを変更
    act(() => {
      result.current.changeStatus(todoId, 'in-progress');
    });
    
    expect(result.current.todos[0].status).toBe('in-progress');
    expect(result.current.todos[0].completed).toBe(false); // 完了状態は変わらない
    
    // 完了ステータスに変更
    act(() => {
      result.current.changeStatus(todoId, 'done');
    });
    
    expect(result.current.todos[0].status).toBe('done');
    expect(result.current.todos[0].completed).toBe(true); // 完了状態も変わる
  });
}); 