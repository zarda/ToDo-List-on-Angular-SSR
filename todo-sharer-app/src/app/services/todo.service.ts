import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  writeBatch,
  serverTimestamp,
  CollectionReference,
  WithFieldValue,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Todo, TodoCreate } from '../models/todo.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly authService: AuthService = inject(AuthService);

  getTodos(listId: string, sortBy: 'order' | 'dueDate' | 'createdAt', direction: 'asc' | 'desc'): Observable<{ loading: boolean, data: Todo[] }> {
    if (!listId) {
      return of({ loading: false, data: [] });
    }
    const todosCollection = collection(this.firestore, `lists/${listId}/todos`) as CollectionReference<Todo>;
    const q = query(todosCollection, orderBy(sortBy, direction));
    return collectionData<Todo, 'id'>(q, { idField: 'id' }).pipe(
      map(todos => ({ loading: false, data: todos })),
      startWith({ loading: true, data: [] as Todo[] })
    );
  }

  async addTodo(listId: string, text: string): Promise<string> {
    const todosCollection = collection(this.firestore, `lists/${listId}/todos`) as CollectionReference<Todo>;
    const currentTimestamp = serverTimestamp();
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    const newTodo: TodoCreate = {
      text,
      completed: false,
      createdAt: currentTimestamp,
      updatedAt: null,
      order: Date.now(), // Simple initial order
      dueDate: null,
      ownerUid: user.uid,
    };
    const docRef = await addDoc(todosCollection, newTodo as WithFieldValue<Todo>);
    return docRef.id;
  }

  async updateTodo(listId: string, todo: Partial<Todo> & { id: string }): Promise<void> {
    const todoDoc = doc(this.firestore, `lists/${listId}/todos/${todo.id}`);
    const { id, ...data } = todo;
    await updateDoc(todoDoc, { ...data, updatedAt: serverTimestamp() });
  }

  async deleteTodo(listId: string, todoId: string): Promise<void> {
    const todoDoc = doc(this.firestore, `lists/${listId}/todos/${todoId}`);
    await deleteDoc(todoDoc);
  }

  async updateTodos(listId: string, updates: Array<Partial<Todo> & { id: string }>): Promise<void> {
    const batch = writeBatch(this.firestore);
    updates.forEach(update => {
      const todoDoc = doc(this.firestore, `lists/${listId}/todos/${update.id}`);
      const { id, ...data } = update;
      batch.update(todoDoc, { ...data, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  }

  async deleteAllTodos(listId: string): Promise<void> {
    const todosCollection = collection(this.firestore, `lists/${listId}/todos`) as CollectionReference<Todo>;
    const todosSnapshot = await getDocs(todosCollection);
    const batch = writeBatch(this.firestore);
    todosSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  async deleteTodos(listId: string, todoIds: string[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    todoIds.forEach(id => {
      const todoDoc = doc(this.firestore, `lists/${listId}/todos/${id}`);
      batch.delete(todoDoc);
    });
    await batch.commit();
  }
}