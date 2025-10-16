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
import { Observable } from 'rxjs';
import { List } from './list';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly todoService = inject(TodoService);

  getLists(userId: string): Observable<List[]> {
    const listsCollection = collection(this.firestore, 'lists');
    const q = query(listsCollection, where('ownerUid', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<List[]>;
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