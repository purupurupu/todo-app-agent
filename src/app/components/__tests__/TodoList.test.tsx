import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TodoList } from '../TodoList';
import { Todo } from '../../types';

// cleanup
afterEach(() => {
  cleanup();
});

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: '高優先度タスク',
      description: '詳細説明1',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'todo',
    },
    {
      id: '2',
      title: '中優先度タスク',
      description: '詳細説明2',
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'todo',
    },
    {
      id: '3',
      title: '完了済みタスク',
      description: '詳細説明3',
      completed: true,
      priority: 'low',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'done',
    },
  ];
  
  const mockOnToggleComplete = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();

  it('タスクリストが正しくレンダリングされること', () => {
    render(
      <TodoList
        todos={mockTodos}
        isLoading={false}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    // 全てのタスクが表示されていることを確認
    expect(screen.getByText('高優先度タスク')).toBeTruthy();
    expect(screen.getByText('中優先度タスク')).toBeTruthy();
    expect(screen.getByText('完了済みタスク')).toBeTruthy();
    
    // タスク数の表示を確認
    expect(screen.getByText(/3 件表示/)).toBeTruthy();
  });

  it('ローディング状態が正しく表示されること', () => {
    render(
      <TodoList
        todos={mockTodos}
        isLoading={true}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    // ローディングインジケータが表示されていることを確認
    const loadingElement = screen.getByText('', { selector: '.relative.w-16.h-16' });
    expect(loadingElement).toBeTruthy();
    
    // タスクリストが表示されていないことを確認
    expect(screen.queryByText('高優先度タスク')).toBeNull();
  });

  it('ステータスフィルターが機能すること', () => {
    render(
      <TodoList
        todos={mockTodos}
        isLoading={false}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    // 「完了済み」フィルターを選択
    const statusFilter = screen.getByLabelText('ステータス') as HTMLSelectElement;
    fireEvent.change(statusFilter, { target: { value: 'completed' } });
    
    // 完了済みタスクのみが表示されていることを確認
    expect(screen.queryByText('高優先度タスク')).toBeNull();
    expect(screen.queryByText('中優先度タスク')).toBeNull();
    expect(screen.getByText('完了済みタスク')).toBeTruthy();
    
    // タスク数の表示を確認
    expect(screen.getByText(/1 件表示/)).toBeTruthy();
  });

  it('優先度フィルターが機能すること', () => {
    render(
      <TodoList
        todos={mockTodos}
        isLoading={false}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    // 「高」優先度フィルターを選択
    const priorityFilter = screen.getByLabelText('優先度') as HTMLSelectElement;
    fireEvent.change(priorityFilter, { target: { value: 'high' } });
    
    // 高優先度タスクのみが表示されていることを確認
    expect(screen.getByText('高優先度タスク')).toBeTruthy();
    expect(screen.queryByText('中優先度タスク')).toBeNull();
    expect(screen.queryByText('完了済みタスク')).toBeNull();
    
    // タスク数の表示を確認
    expect(screen.getByText(/1 件表示/)).toBeTruthy();
  });

  it('編集モードが正しく機能すること', () => {
    render(
      <TodoList
        todos={mockTodos}
        isLoading={false}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    // 編集ボタンをクリック
    const editButtons = screen.getAllByLabelText('編集');
    fireEvent.click(editButtons[0]); // 最初のタスクの編集ボタン
    
    // 編集フォームが表示されていることを確認
    const titleInput = screen.getByLabelText(/タイトル/i) as HTMLInputElement;
    expect(titleInput.value).toBe('高優先度タスク');
    
    // フォームを更新して送信
    fireEvent.change(titleInput, { target: { value: '更新されたタスク' } });
    const updateButton = screen.getByRole('button', { name: /更新/i });
    fireEvent.click(updateButton);
    
    // onUpdateが正しく呼ばれることを確認
    expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
      title: '更新されたタスク',
    }));
  });

  it('空のリストが正しく表示されること', () => {
    render(
      <TodoList
        todos={[]}
        isLoading={false}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    // 空のリストメッセージが表示されていることを確認
    expect(screen.getByText(/タスクがありません/i)).toBeTruthy();
  });
}); 