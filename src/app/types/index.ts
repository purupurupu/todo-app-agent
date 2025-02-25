export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

export type TodoFormData = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>; 