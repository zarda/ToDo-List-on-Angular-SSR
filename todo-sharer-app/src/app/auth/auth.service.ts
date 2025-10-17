import { Injectable, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User as AuthUser } from '@angular/fire/auth';
import { collection, doc, docData, Firestore, setDoc, DocumentData } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of, map } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private usersCollection = collection(this.firestore, 'users');

  /**
   * An observable that emits the currently authenticated user's profile from Firestore,
   * or null if no user is logged in.
   */
  readonly user$: Observable<User | null>;

  /**
   * A signal that provides synchronous access to the current user object.
   */
  readonly currentUser: Signal<User | null>;

  constructor() {
    this.user$ = user(this.auth).pipe(
      switchMap((firebaseUser: AuthUser | null) => {
        if (firebaseUser) {
          // If a user is logged in, listen to their document in the 'users' collection.
          const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
          return docData(userDocRef) as Observable<User | undefined>;
        } else {
          // If no user is logged in, emit null.
          return of(null);
        }
      }),
      map(user => user ?? null), // Coalesce undefined to null
      shareReplay(1) // Cache the last emitted user object and replay it for new subscribers.
    );
    this.currentUser = toSignal(this.user$, { initialValue: null });
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      await this.updateUserData(credential.user); // Ensure user data is in Firestore
      await this.router.navigate(['/']); // Redirect to the main page after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw the error for the component to handle
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']); // Explicitly redirect to login page
  }

  private updateUserData(user: AuthUser): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    if (!user.email) {
      throw new Error("User email is not available.");
    }
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return setDoc(userDocRef, data, { merge: true });
  }
}