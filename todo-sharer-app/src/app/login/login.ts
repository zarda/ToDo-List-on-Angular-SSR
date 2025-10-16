import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  protected readonly error = signal<string | null>(null);

  async loginWithGoogle() {
    this.error.set(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      // The auth guard will handle redirection upon successful login.
      // Or you can explicitly navigate:
      this.router.navigate(['/todos']);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }
}