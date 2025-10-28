import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  protected readonly authService = inject(AuthService);
  private readonly router: Router = inject(Router);
  protected readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  constructor() {
    // If the user is already logged in, redirect them away from the login page.
    effect(() => {
      if (this.authService.currentUser()) {
        this.router.navigate(['/']);
      }
    });
  }

  async login(): Promise<void> {
    if (this.loading()) return;
    this.error.set(null);
    this.loading.set(true);

    try {
      await this.authService.loginWithGoogle();
    } catch (e: any) {
      const message =
        e.code === 'auth/popup-closed-by-user'
          ? 'Login was cancelled.'
          : 'Login failed. Please check console for details.';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}