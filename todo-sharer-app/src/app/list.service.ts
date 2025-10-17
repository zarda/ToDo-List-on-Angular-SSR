import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TodoService } from './todo.service';
import { List } from './list';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly todoService = inject(TodoService);

  getLists(userId: string | undefined): Observable<{ loading: boolean; data: List[] }> {
    if (!userId) {
      return of({ loading: false, data: [] });
    }
    const listsCollection = collection(this.firestore, 'lists');
    const q = query(listsCollection, where('ownerUid', '==', userId)) as any;
    return collectionData<List>(q, { idField: 'id' }).pipe(
      map(data => ({ loading: false, data })),
      startWith({ loading: true, data: [] })
    );
  }

  async addList(userId: string, name:string): Promise<string> {
    const listsCollection = collection(this.firestore, 'lists');
    const docRef = await addDoc(listsCollection, { name, ownerUid: userId});
    return docRef.id
  }

  async updateList(listId: string, name: string): Promise<void> {
    const listDoc = doc(this.firestore, `lists/${listId}`);
    await updateDoc(listDoc, { name });
  }

  async deleteList(listId: string): Promise<void> {
    await this.todoService.deleteAllTodos(listId);
    const listDoc = doc(this.firestore, `lists/${listId}`);
    await deleteDoc(listDoc);
  }
}