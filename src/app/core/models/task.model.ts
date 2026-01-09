export interface Task {
  id: string;
  title: string;
  done: boolean;
  categoryId?: string; // opcional
  createdAt: number;
  updatedAt: number;
}