import { Component, inject, signal, OnInit, OnDestroy, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Navigation } from './navigation/navigation';
import { AuthService } from './auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigation, MatIconModule, MatButtonModule], // RouterOutlet is still needed here
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('todo-sharer-app');
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private authSubscription?: Subscription;
  isDarkMode = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Check if the code is running in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        this.isDarkMode.set(true);
        this.renderer.addClass(this.document.documentElement, 'dark-theme');
      } else {
        this.isDarkMode.set(false);
        this.renderer.removeClass(this.document.documentElement, 'dark-theme');
      }

      // Listen to auth state changes and redirect to login if user logs out
      // while on a protected route
      this.authSubscription = this.authService.user$.pipe(
        filter(() => this.router.url !== '/login') // Only redirect if not already on login page
      ).subscribe(user => {
        if (!user && this.router.url !== '/login') {
          // User logged out while on a protected page, redirect to login
          this.router.navigate(['/login']);
        }
      });
    }
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    this.authSubscription?.unsubscribe();
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode()) {
        this.renderer.addClass(this.document.documentElement, 'dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        this.renderer.removeClass(this.document.documentElement, 'dark-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
