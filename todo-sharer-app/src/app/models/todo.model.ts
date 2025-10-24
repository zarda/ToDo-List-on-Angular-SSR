import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  dueDate: Timestamp | null;
  order: number;
}

// Type for creating a new to-do, where some fields are set by the server.
export type TodoCreate = Omit<Todo, 'id' | 'createdAt' | 'dueDate'> & { createdAt: FieldValue; dueDate: FieldValue };