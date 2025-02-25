import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'テストタスク',
    description: '詳細説明',
    completed: false,
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const mockOnToggleComplete = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  it('タスクのタイトルが正しく表示されること', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('完了ボタンをクリックするとonToggleCompleteが呼ばれること', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    const checkbox = screen.getByLabelText('タスク完了にする');
    fireEvent.click(checkbox);
    
    expect(mockOnToggleComplete).toHaveBeenCalledWith('1');
  });

  it('削除ボタンをクリックするとonDeleteが呼ばれること', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    const deleteButton = screen.getByLabelText('削除');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('優先度が正しく表示されること', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('中')).toBeInTheDocument();
  });
}); 