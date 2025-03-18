export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  description: string | null;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  order: number | null;
}

export type TodoFormData = {
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  description: string | null;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  order?: number | null;
};

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