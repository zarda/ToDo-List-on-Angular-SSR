import { Component, inject, signal, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';
import { AuthService } from './auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigation, MatIconModule], // RouterOutlet is still needed here
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('todo-sharer-app');
  protected readonly authService = inject(AuthService);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  isDarkMode = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        this.isDarkMode.set(true);
        this.renderer.addClass(this.document.documentElement, 'dark-theme');
      } else {
        this.isDarkMode.set(false);
        this.renderer.removeClass(this.document.documentElement, 'dark-theme');
      }
    }
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
    if (this.isDarkMode()) {
      this.renderer.addClass(this.document.documentElement, 'dark-theme');
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark-theme');
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
