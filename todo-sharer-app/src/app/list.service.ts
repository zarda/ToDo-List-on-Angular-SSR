import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  serverTimestamp,
  getDocs,
  getDoc,
  writeBatch,
  or,
  CollectionReference,
  Query,
  DocumentData,
  FieldValue,
} from '@angular/fire/firestore';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap, startWith, catchError } from 'rxjs/operators';
import { List } from './list';
import { User } from './user';

type ListDocument = Omit<List, 'id' | 'createdAt' | 'collaborators' | 'ownerEmail' | 'ownerPhotoURL'> & {
  createdAt: ReturnType<typeof serverTimestamp>;
};

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly firestore: Firestore = inject(Firestore);

  // Helper to fetch user profiles by UIDs or emails
  private async _fetchUserProfiles(uids?: string[], emails?: string[]): Promise<User[]> {
    const usersMap = new Map<string, User>();
    const usersCollection = collection(this.firestore, 'users');
    const promises: Promise<void>[] = [];
  
    const fetchInChunks = (field: 'uid' | 'email', values: string[]) => {
      for (let i = 0; i < values.length; i += 30) {
        const chunk = values.slice(i, i + 30);
        if (chunk.length > 0) {
          const q = query(usersCollection, where(field, 'in', chunk));
          promises.push(getDocs(q).then(snapshot => {
            snapshot.forEach(doc => {
              const user = doc.data() as User;
              if (!usersMap.has(user.uid)) {
                usersMap.set(user.uid, user);
              }
            });
          }));
        }
      }
    };
  
    if (uids && uids.length > 0) {
      fetchInChunks('uid', uids);
    }
  
    if (emails && emails.length > 0) {
      fetchInChunks('email', emails);
    }
  
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  
    return Array.from(usersMap.values());
  }

  private async _enrichListsWithProfiles(lists: List[]): Promise<List[]> {
    try {
      // If there are no lists, no need to fetch profiles
      if (lists.length === 0) {
        return [];
      }

      // Collect all unique UIDs and emails needed for fetching profiles
      const allUids = new Set<string>();
      const allEmails = new Set<string>();

      lists.forEach(list => {
        allUids.add(list.ownerUid);
        Object.keys(list.sharedWith || {}).forEach(uid => allUids.add(uid));
      });

      // Fetch all required user profiles in one go
      const allProfiles = await this._fetchUserProfiles(Array.from(allUids), Array.from(allEmails));
      const profileMapByUid = new Map<string, User>();
      const profileMapByEmail = new Map<string, User>();
      allProfiles.forEach(profile => {
        profileMapByUid.set(profile.uid, profile);
        if (profile.email) {
          profileMapByEmail.set(profile.email, profile);
        }
      });

      // Enrich lists with owner and collaborator data
      return lists.map(list => {
        const ownerProfile = profileMapByUid.get(list.ownerUid);
        const enrichedList: List = {
          ...list,
          ownerEmail: ownerProfile?.email || 'Unknown',
          ownerPhotoURL: ownerProfile?.photoURL || 'assets/default-avatar.png',
          collaborators: Object.keys(list.sharedWith || {})
            .map(uid => profileMapByUid.get(uid))
            .filter((c): c is User => !!c) ?? [],
        };
        return enrichedList;
      });
    } catch (error) {
      console.error('Error enriching lists with profile data:', error);
      // Return the original lists to avoid breaking the stream
      return lists;
    }
  }

  private async _findUserByEmail(email: string): Promise<User | null> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    // Assuming email is unique, so we take the first result.
    const userDoc = snapshot.docs[0];
    return { ...userDoc.data(), uid: userDoc.id } as User;
  }


  getLists(currentUser: User): Observable<{ loading: boolean; data: List[] }> {
    if (!currentUser) {
      return of({ loading: false, data: [] });
    }

    const listsCollection = collection(this.firestore, 'lists') as CollectionReference<List>;

    // Use an OR query to fetch lists where the user is either the owner or a collaborator
    const q = query(listsCollection, or(
      where('ownerUid', '==', currentUser.uid),
      where(`sharedWith.${currentUser.uid}`, '==', true)
    ));

    return (collectionData(q, { idField: 'id' })).pipe(
      mergeMap(lists => this._enrichListsWithProfiles(lists)),
      map(lists => ({ loading: false, data: lists })),
      startWith({ loading: true, data: [] as List[] }),
      catchError(error => {
        console.error('Error fetching lists:', error);
        return of({ loading: false, data: [] });
      })
    );
  }

  async addList(ownerUid: string, name: string, sharedWith: Record<string, boolean>): Promise<string> {
    const listsCollection = collection(this.firestore, 'lists') as CollectionReference<DocumentData>;
    const newList: ListDocument = {
      name,
      ownerUid,
      createdAt: serverTimestamp(),
      sharedWith, // Initialize with empty map {}
    };
    const docRef = await addDoc(listsCollection, newList);
    return docRef.id;
  }

  async updateList(listId: string, name: string): Promise<void> {
    const listDoc = doc(this.firestore, `lists/${listId}`);
    await updateDoc(listDoc, { name });
  }

  async deleteList(listId: string): Promise<void> {
    // This method is now intended for deleting a list document only.
    // For deleting a list and its todos, use deleteListAndTodos.
    await deleteDoc(doc(this.firestore, `lists/${listId}`));
  }

  async deleteListAndTodos(listId: string): Promise<void> {
    const batch = writeBatch(this.firestore);

    // 1. Delete all todos in the subcollection
    const todosCollection = collection(this.firestore, `lists/${listId}/todos`);
    const todosSnapshot = await getDocs(todosCollection);
    todosSnapshot.forEach(doc => batch.delete(doc.ref));

    // 2. Delete the list document itself
    batch.delete(doc(this.firestore, `lists/${listId}`));

    // 3. Commit the batch
    await batch.commit();
  }

  async shareList(listId: string, sharedWithUpdate: Record<string, boolean>): Promise<void> {
    const email = Object.keys(sharedWithUpdate)[0];
    if (!email) {
      throw new Error('No email provided for sharing.');
    }

    const userToShareWith = await this._findUserByEmail(email);
    if (!userToShareWith) {
      throw new Error(`User with email "${email}" not found.`);
    }

    const listDoc = doc(this.firestore, `lists/${listId}`);
    const listSnapshot = await getDoc(listDoc);
    if (!listSnapshot.exists()) {
      throw new Error('List not found.');
    }

    if (listSnapshot.data()['ownerUid'] === userToShareWith.uid) {
      throw new Error('You cannot share a list with its owner.');
    }

    await updateDoc(listDoc, { [`sharedWith.${userToShareWith.uid}`]: true });
  }

  async unshareList(listId: string, uid: string): Promise<void> {
    const listDoc = doc(this.firestore, `lists/${listId}`);
    await updateDoc(listDoc, { [`sharedWith.${uid}`]: deleteField() });
  }
}