export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  order?: number;
}

export type TodoFormData = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export interface KanbanColumn {
  id: string;
  title: string;
  status: Todo['status'];
  color: string;
}

export interface DragItem {
  id: string;
  type: string;
  status: Todo['status'];
  index: number;
} 