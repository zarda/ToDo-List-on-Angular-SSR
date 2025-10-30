import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let authMock: any;
  let firestoreMock: any;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create proper mocks with required Firebase structures
    authMock = {
      app: {
        name: '[DEFAULT]',
        options: {},
        automaticDataCollectionEnabled: false
      },
      config: {},
      name: '[DEFAULT]'
    };

    firestoreMock = {
      app: {
        name: '[DEFAULT]',
        options: {},
        automaticDataCollectionEnabled: false
      },
      type: 'firestore',
      toJSON: () => ({})
    };

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routerMock.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: Firestore, useValue: firestoreMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AuthService).toBe('function');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have user$ observable', () => {
    expect(service.user$).toBeDefined();
  });

  it('should have currentUser signal', () => {
    expect(service.currentUser).toBeDefined();
    expect(typeof service.currentUser).toBe('function');
  });

  describe('Service methods', () => {
    it('should have loginWithGoogle method', () => {
      expect(typeof service.loginWithGoogle).toBe('function');
    });

    it('should have logout method', () => {
      expect(typeof service.logout).toBe('function');
    });
  });

  describe('currentUser signal', () => {
    it('should provide current user value', () => {
      const user = service.currentUser();
      // Should return null initially or a user object
      expect(user === null || typeof user === 'object').toBeTrue();
    });
  });
});
