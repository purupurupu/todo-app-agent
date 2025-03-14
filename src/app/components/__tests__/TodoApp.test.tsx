import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TodoApp } from '../TodoApp';
import { useTodos } from '../../hooks/useTodos';

// useTodosフックをモック
vi.mock('../../hooks/useTodos', () => ({
  useTodos: vi.fn(),
}));

// cleanup
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('TodoApp', () => {
  const mockAddTodo = vi.fn();
  const mockUpdateTodo = vi.fn();
  const mockDeleteTodo = vi.fn();
  const mockToggleComplete = vi.fn();
  
  const mockTodos = [
    {
      id: '1',
      title: 'テストタスク1',
      description: '詳細説明1',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'todo',
    },
    {
      id: '2',
      title: 'テストタスク2',
      description: '詳細説明2',
      completed: true,
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'done',
    },
  ];

  beforeEach(() => {
    // useTodosフックの戻り値をモック
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      todos: mockTodos,
      isLoading: false,
      addTodo: mockAddTodo,
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo,
      toggleComplete: mockToggleComplete,
    });
  });

  it('アプリが正しくレンダリングされること', () => {
    render(<TodoApp />);
    
    // ヘッダーが表示されていることを確認（h1要素を指定）
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement.textContent).toBe('爽快感のあるTODOアプリ');
    
    // TodoFormが表示されていることを確認
    expect(screen.getByLabelText(/タイトル/i)).toBeTruthy();
    
    // TodoListが表示されていることを確認
    expect(screen.getByText('テストタスク1')).toBeTruthy();
    expect(screen.getByText('テストタスク2')).toBeTruthy();
  });

  it('新しいタスクを追加できること', () => {
    render(<TodoApp />);
    
    // フォームに値を入力
    const titleInput = screen.getByLabelText(/タイトル/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: '新しいタスク' } });
    
    // フォームを送信
    const submitButtons = screen.getAllByRole('button');
    const addButton = submitButtons.find(button => button.textContent === '追加');
    fireEvent.click(addButton!);
    
    // addTodoが呼ばれることを確認
    expect(mockAddTodo).toHaveBeenCalledWith(expect.objectContaining({
      title: '新しいタスク',
    }));
  });

  it('タスクの完了状態を切り替えられること', () => {
    render(<TodoApp />);
    
    // 完了チェックボックスをクリック
    const checkboxes = screen.getAllByLabelText(/タスク完了にする/i);
    fireEvent.click(checkboxes[0]); // 最初のタスクのチェックボックス
    
    // toggleCompleteが呼ばれることを確認
    expect(mockToggleComplete).toHaveBeenCalledWith('1');
  });

  it('ローディング状態が正しく表示されること', () => {
    // ローディング状態をモック
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      todos: [],
      isLoading: true,
      addTodo: mockAddTodo,
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo,
      toggleComplete: mockToggleComplete,
    });
    
    render(<TodoApp />);
    
    // ローディングインジケータが表示されていることを確認
    const loadingElement = screen.getByText('', { selector: '.relative.w-16.h-16' });
    expect(loadingElement).toBeTruthy();
  });
}); 