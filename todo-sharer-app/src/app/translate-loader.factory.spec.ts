import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey, PLATFORM_ID } from '@angular/core';
import { CustomTranslateLoader, createTranslateLoader } from './translate-loader.factory';

describe('CustomTranslateLoader', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let transferState: TransferState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    transferState = TestBed.inject(TransferState);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Browser environment', () => {
    let loader: CustomTranslateLoader;

    beforeEach(() => {
      loader = new CustomTranslateLoader(httpClient, transferState, 'browser');
    });

    it('should be created', () => {
      expect(loader).toBeTruthy();
    });

    it('should fetch translations via HTTP on browser', (done) => {
      const mockTranslations = { hello: 'Hello', world: 'World' };

      loader.getTranslation('en').subscribe(translations => {
        expect(translations).toEqual(mockTranslations);
        done();
      });

      const req = httpMock.expectOne('/assets/i18n/en.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslations);
    });

    it('should return empty object on HTTP error', (done) => {
      loader.getTranslation('invalid').subscribe(translations => {
        expect(translations).toEqual({});
        done();
      });

      const req = httpMock.expectOne('/assets/i18n/invalid.json');
      req.error(new ProgressEvent('error'));
    });

    it('should return translations from TransferState if available', (done) => {
      const mockTranslations = { cached: 'Cached translation' };
      const key = makeStateKey<any>('translations-en');
      transferState.set(key, mockTranslations);

      loader.getTranslation('en').subscribe(translations => {
        expect(translations).toEqual(mockTranslations);
        done();
      });

      // No HTTP request should be made
      httpMock.expectNone('/assets/i18n/en.json');
    });

    it('should remove TransferState key after retrieving', (done) => {
      const mockTranslations = { cached: 'Cached translation' };
      const key = makeStateKey<any>('translations-fr');
      transferState.set(key, mockTranslations);

      loader.getTranslation('fr').subscribe(() => {
        expect(transferState.hasKey(key)).toBeFalse();
        done();
      });
    });

    it('should store translations in TransferState after HTTP fetch', (done) => {
      const mockTranslations = { hello: 'Bonjour' };
      const key = makeStateKey<any>('translations-fr');

      loader.getTranslation('fr').subscribe(() => {
        expect(transferState.get(key, null)).toEqual(mockTranslations);
        done();
      });

      const req = httpMock.expectOne('/assets/i18n/fr.json');
      req.flush(mockTranslations);
    });
  });

  describe('Server environment', () => {
    let loader: CustomTranslateLoader;

    beforeEach(() => {
      loader = new CustomTranslateLoader(httpClient, transferState, 'server');
    });

    it('should be created for server platform', () => {
      expect(loader).toBeTruthy();
    });

    it('should return empty object when file not found on server', (done) => {
      loader.getTranslation('nonexistent').subscribe(translations => {
        expect(translations).toEqual({});
        done();
      });

      // No HTTP request should be made on server
      httpMock.expectNone('/assets/i18n/nonexistent.json');
    });
  });

  describe('createTranslateLoader factory', () => {
    it('should create a CustomTranslateLoader instance', () => {
      const loader = createTranslateLoader(httpClient, transferState, 'browser');
      expect(loader).toBeInstanceOf(CustomTranslateLoader);
    });
  });
});
