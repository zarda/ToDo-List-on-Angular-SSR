import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  DocumentReference,
  CollectionReference,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly firestore: Firestore = inject(Firestore);

  getTodos(listId: string): Observable<{ loading: boolean, data: Todo[] }> {
    const todosCollection = collection( // Specify the type of the collection
      this.firestore,
      `lists/${listId}/todos`
    ) as CollectionReference<Todo>;
    return collectionData<Todo>(todosCollection, { idField: 'id' }).pipe(
      map(data => ({ loading: false, data })),
      startWith({ loading: true, data: [] })
    );
  }

  async addTodo(listId: string, text: string): Promise<DocumentReference> {
    const todosCollection = collection( // Specify the type of the collection
      this.firestore,
      `lists/${listId}/todos`
    ) as CollectionReference<Omit<Todo, 'id'>>;
    return await addDoc(todosCollection, { text, completed: false } as Omit<Todo, 'id'>);
  }

  async updateTodo(listId: string, todo: Todo): Promise<void> {
    const todoDoc = doc(
      this.firestore,
      `lists/${listId}/todos/${todo.id}`
    );
    const { id, ...data } = todo;
    await updateDoc(todoDoc, data);
  }

  async deleteTodo(listId: string, todoId: string): Promise<void> {
    const todoDoc = doc(this.firestore, `lists/${listId}/todos/${todoId}`);
    await deleteDoc(todoDoc);
  }

  async deleteAllTodos(listId: string): Promise<void> {
    const todosCollection = collection(
      this.firestore,
      `lists/${listId}/todos`
    );
    const todosSnapshot = await getDocs(todosCollection);
    const batch = writeBatch(this.firestore);
    todosSnapshot.forEach(todoDoc => batch.delete(todoDoc.ref));
    await batch.commit();
  }
}