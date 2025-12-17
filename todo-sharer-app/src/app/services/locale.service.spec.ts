import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocaleService, LocaleInfo } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;
  let translateService: jasmine.SpyObj<TranslateService>;

  describe('Browser environment', () => {
    beforeEach(() => {
      translateService = jasmine.createSpyObj('TranslateService', [
        'use',
        'getBrowserLang'
      ], {
        currentLang: 'en'
      });
      translateService.getBrowserLang.and.returnValue('en');
      translateService.use.and.returnValue({} as any);

      // Mock localStorage
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(localStorage, 'setItem');

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          LocaleService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: TranslateService, useValue: translateService }
        ]
      });

      service = TestBed.inject(LocaleService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call translateService.use on initialization', () => {
      expect(translateService.use).toHaveBeenCalled();
    });

    it('should use stored locale preference if available', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('fr');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          LocaleService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: TranslateService, useValue: translateService }
        ]
      });

      const newService = TestBed.inject(LocaleService);
      expect(translateService.use).toHaveBeenCalledWith('fr');
    });

    it('should use browser language if no stored preference', () => {
      translateService.getBrowserLang.and.returnValue('de');
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          LocaleService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: TranslateService, useValue: translateService }
        ]
      });

      const newService = TestBed.inject(LocaleService);
      expect(translateService.use).toHaveBeenCalledWith('de');
    });

    it('should return current locale', () => {
      expect(service.getCurrentLocale()).toBe('en');
    });

    it('should return available locales', () => {
      const locales = service.getAvailableLocales();
      expect(locales.length).toBe(10);
      expect(locales[0].code).toBe('en');
    });

    it('should return current locale info', () => {
      const localeInfo = service.getCurrentLocaleInfo();
      expect(localeInfo.code).toBe('en');
      expect(localeInfo.name).toBe('English');
    });

    it('should switch locale and store preference', () => {
      service.switchLocale('fr');
      expect(translateService.use).toHaveBeenCalledWith('fr');
      expect(localStorage.setItem).toHaveBeenCalledWith('preferredLocale', 'fr');
    });

    it('should get stored locale preference', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('es');
      expect(service.getStoredLocalePreference()).toBe('es');
    });
  });

  describe('Server environment (SSR)', () => {
    beforeEach(() => {
      translateService = jasmine.createSpyObj('TranslateService', [
        'use',
        'getBrowserLang'
      ], {
        currentLang: 'en'
      });
      translateService.use.and.returnValue({} as any);

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          LocaleService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: TranslateService, useValue: translateService }
        ]
      });

      service = TestBed.inject(LocaleService);
    });

    it('should be created in server environment', () => {
      expect(service).toBeTruthy();
    });

    it('should use default "en" language on server', () => {
      expect(translateService.use).toHaveBeenCalledWith('en');
    });

    it('should not call getBrowserLang on server', () => {
      expect(translateService.getBrowserLang).not.toHaveBeenCalled();
    });

    it('should return null for stored locale preference on server', () => {
      expect(service.getStoredLocalePreference()).toBeNull();
    });

    it('should not throw when switching locale on server', () => {
      expect(() => service.switchLocale('fr')).not.toThrow();
      expect(translateService.use).toHaveBeenCalledWith('fr');
    });
  });

  describe('Locale validation', () => {
    beforeEach(() => {
      translateService = jasmine.createSpyObj('TranslateService', [
        'use',
        'getBrowserLang'
      ], {
        currentLang: 'en'
      });
      translateService.getBrowserLang.and.returnValue('invalid-lang');
      translateService.use.and.returnValue({} as any);

      spyOn(localStorage, 'getItem').and.returnValue('invalid-lang');
      spyOn(localStorage, 'setItem');

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          LocaleService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: TranslateService, useValue: translateService }
        ]
      });

      service = TestBed.inject(LocaleService);
    });

    it('should fallback to "en" for invalid stored locale', () => {
      expect(translateService.use).toHaveBeenCalledWith('en');
    });

    it('should return first locale if current language not found', () => {
      Object.defineProperty(translateService, 'currentLang', { value: 'invalid' });
      const localeInfo = service.getCurrentLocaleInfo();
      expect(localeInfo.code).toBe('en');
    });
  });
});
