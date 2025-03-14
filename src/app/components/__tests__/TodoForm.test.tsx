import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TodoForm } from '../TodoForm';
import { TodoFormData } from '../../types';

// cleanup
afterEach(() => {
  cleanup();
});

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('初期状態で正しくレンダリングされること', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    // 必須要素が存在するか確認
    expect(screen.getByLabelText(/タイトル/i)).toBeTruthy();
    expect(screen.getByLabelText(/優先度/i)).toBeTruthy();
    expect(screen.getByText(/詳細を追加/i)).toBeTruthy();
    // 送信ボタンを特定（テキストで特定）
    const submitButtons = screen.getAllByRole('button');
    const addButton = submitButtons.find(button => button.textContent === '追加');
    expect(addButton).toBeTruthy();
  });

  it('タイトルが空の場合、エラーメッセージが表示されること', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    // 空のタイトルで送信
    const submitButtons = screen.getAllByRole('button');
    const addButton = submitButtons.find(button => button.textContent === '追加');
    fireEvent.click(addButton!);
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText(/タイトルを入力してください/i)).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('フォームが正しく送信されること', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    // フォームに値を入力
    const titleInput = screen.getByLabelText(/タイトル/i);
    fireEvent.change(titleInput, { target: { value: 'テストタスク' } });
    
    const prioritySelect = screen.getByLabelText(/優先度/i);
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    
    // 詳細を展開
    const detailsButton = screen.getByText(/詳細を追加/i);
    fireEvent.click(detailsButton);
    
    // 詳細を入力
    const descriptionTextarea = screen.getByLabelText(/詳細/i);
    fireEvent.change(descriptionTextarea, { target: { value: 'テストの詳細説明' } });
    
    // フォームを送信
    const submitButtons = screen.getAllByRole('button');
    const addButton = submitButtons.find(button => button.textContent === '追加');
    fireEvent.click(addButton!);
    
    // onSubmitが正しい値で呼ばれることを確認
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'テストタスク',
      completed: false,
      priority: 'high',
      description: 'テストの詳細説明',
    });
  });

  it('編集モードで正しくレンダリングされること', () => {
    const initialData: Partial<TodoFormData> = {
      title: '既存タスク',
      priority: 'medium',
      description: '既存の説明',
      completed: false,
    };
    
    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        initialData={initialData} 
        isEditing={true} 
        onCancel={mockOnCancel} 
      />
    );
    
    // 初期値が正しく設定されていることを確認
    const titleInput = screen.getByLabelText(/タイトル/i) as HTMLInputElement;
    const prioritySelect = screen.getByLabelText(/優先度/i) as HTMLSelectElement;
    const descriptionTextarea = screen.getByLabelText(/詳細/i) as HTMLTextAreaElement;
    
    expect(titleInput.value).toBe('既存タスク');
    expect(prioritySelect.value).toBe('medium');
    expect(descriptionTextarea.value).toBe('既存の説明');
    
    // 編集モード特有のボタンが表示されていることを確認
    const buttons = screen.getAllByRole('button');
    const updateButton = buttons.find(button => button.textContent === '更新');
    const cancelButton = buttons.find(button => button.textContent === 'キャンセル');
    expect(updateButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
  });

  it('キャンセルボタンが機能すること', () => {
    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        isEditing={true} 
        onCancel={mockOnCancel} 
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const cancelButton = buttons.find(button => button.textContent === 'キャンセル');
    fireEvent.click(cancelButton!);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('詳細の表示/非表示が切り替わること', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    // 初期状態では詳細フィールドは表示されていない
    expect(screen.queryByLabelText(/詳細/i)).toBeNull();
    
    // 詳細を表示
    const showDetailsButton = screen.getByText(/詳細を追加/i);
    fireEvent.click(showDetailsButton);
    
    // 詳細フィールドが表示される
    expect(screen.getByLabelText(/詳細/i)).toBeTruthy();
    
    // 詳細を非表示
    const hideDetailsButton = screen.getByText(/詳細を隠す/i);
    fireEvent.click(hideDetailsButton);
    
    // 詳細フィールドが非表示になる
    expect(screen.queryByLabelText(/詳細/i)).toBeNull();
  });
}); 