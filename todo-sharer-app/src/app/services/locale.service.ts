import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private translateService = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly locales: LocaleInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh-Hans', name: 'Simplified Chinese', nativeName: '简体中文' },
    { code: 'zh-Hant', name: 'Traditional Chinese', nativeName: '繁體中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ];

  constructor() {
    // Determine initial language
    let initialLang = 'en';

    if (this.isBrowser) {
      // Browser: check stored preference or browser language
      const storedLocale = this.getStoredLocalePreference();
      const browserLang = this.translateService.getBrowserLang();

      if (storedLocale && this.locales.some(l => l.code === storedLocale)) {
        initialLang = storedLocale;
      } else if (browserLang && this.locales.some(l => l.code === browserLang)) {
        initialLang = browserLang;
      }
    }
    // Server: always use default 'en' (translations loaded via TransferState)

    this.translateService.use(initialLang);
  }

  getCurrentLocale(): string {
    return this.translateService.currentLang || 'en';
  }

  getAvailableLocales(): LocaleInfo[] {
    return this.locales;
  }

  getCurrentLocaleInfo(): LocaleInfo {
    const currentLang = this.getCurrentLocale();
    return this.locales.find((l) => l.code === currentLang) || this.locales[0];
  }

  switchLocale(localeCode: string): void {
    // Store the selected locale preference
    this.storeLocalePreference(localeCode);

    // Use ngx-translate to switch language instantly (no reload required!)
    this.translateService.use(localeCode);
  }

  private storeLocalePreference(localeCode: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem('preferredLocale', localeCode);
    } catch {
      // LocalStorage might not be available
    }
  }

  getStoredLocalePreference(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem('preferredLocale');
    } catch {
      return null;
    }
  }
}
