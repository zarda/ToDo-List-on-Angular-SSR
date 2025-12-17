import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';

const TRANSLATIONS_KEY = (lang: string) => makeStateKey<any>(`translations-${lang}`);

/**
 * Custom TranslateLoader implementation with SSR support
 * Uses TransferState to transfer translations from server to client
 */
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    private platformId: Object
  ) {}

  getTranslation(lang: string): Observable<any> {
    const key = TRANSLATIONS_KEY(lang);

    // Check if translations are already in transfer state (from SSR)
    const storedTranslations = this.transferState.get(key, null);
    if (storedTranslations) {
      this.transferState.remove(key);
      return of(storedTranslations);
    }

    // On server, read from file system directly
    if (isPlatformServer(this.platformId)) {
      try {
        // Dynamic import for server-only code
        const fs = require('fs');
        const path = require('path');
        // Try multiple possible paths for different deployment scenarios
        const possiblePaths = [
          // Firebase Functions / Cloud Run: relative to cwd
          path.join(process.cwd(), 'dist', 'todo-sharer-app', 'browser', 'assets', 'i18n', `${lang}.json`),
          // Alternative: browser folder directly under cwd
          path.join(process.cwd(), 'browser', 'assets', 'i18n', `${lang}.json`),
          // Deployed structure: assets under dist
          path.resolve('dist', 'todo-sharer-app', 'browser', 'assets', 'i18n', `${lang}.json`),
        ];

        let translations = null;
        for (const filePath of possiblePaths) {
          try {
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf8');
              translations = JSON.parse(content);
              break;
            }
          } catch {
            // Try next path
          }
        }

        if (translations) {
          // Store in transfer state for client hydration
          this.transferState.set(key, translations);
          return of(translations);
        }

        console.warn(`Failed to load translations for ${lang} from file system`);
        return of({});
      } catch (error) {
        console.warn(`Failed to load translations for ${lang} from file system:`, error);
        return of({});
      }
    }

    // On browser, fetch via HTTP and store for potential future SSR
    return this.http.get<any>(`/assets/i18n/${lang}.json`).pipe(
      tap(translations => {
        this.transferState.set(key, translations);
      }),
      catchError(() => {
        console.warn(`Failed to load translations for ${lang}`);
        return of({});
      })
    );
  }
}

/**
 * Factory function for TranslateLoader
 */
export function createTranslateLoader(http: HttpClient, transferState: TransferState, platformId: Object): TranslateLoader {
  return new CustomTranslateLoader(http, transferState, platformId);
}
