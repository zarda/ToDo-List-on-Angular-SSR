import { Injectable, inject } from '@angular/core';
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

  private readonly locales: LocaleInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh-Hant', name: 'Traditional Chinese', nativeName: '繁體中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ];

  constructor() {
    // Initialize the translation service with stored preference or browser language
    const storedLocale = this.getStoredLocalePreference();
    const browserLang = this.translateService.getBrowserLang();

    // Determine initial language
    let initialLang = 'en';
    if (storedLocale && this.locales.some(l => l.code === storedLocale)) {
      initialLang = storedLocale;
    } else if (browserLang && this.locales.some(l => l.code === browserLang)) {
      initialLang = browserLang;
    }

    // Set the default language and use it
    this.translateService.setDefaultLang('en');
    this.translateService.use(initialLang);
  }

  getCurrentLocale(): string {
    return this.translateService.currentLang || this.translateService.defaultLang || 'en';
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
    try {
      localStorage.setItem('preferredLocale', localeCode);
    } catch (e) {
      // LocalStorage might not be available
    }
  }

  getStoredLocalePreference(): string | null {
    try {
      return localStorage.getItem('preferredLocale');
    } catch (e) {
      return null;
    }
  }
}
