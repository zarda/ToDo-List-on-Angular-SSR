import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { TodoService } from './todo.service';
import { AuthService } from './auth/auth.service';
import { User } from './user';
import { signal } from '@angular/core';

describe('TodoService', () => {
  let service: TodoService;
  let firestoreMock: Partial<Firestore>;
  let authServiceMock: { currentUser: jasmine.Spy };

  beforeEach(() => {
    firestoreMock = { app: {} as any };
    const mockUser: User = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null
    };
    authServiceMock = {
      currentUser: jasmine.createSpy('currentUser').and.returnValue(mockUser)
    };

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: Firestore, useValue: firestoreMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty data when no listId is provided', (done) => {
    service.getTodos('', 'order', 'asc').subscribe(result => {
      expect(result.loading).toBeFalse();
      expect(result.data).toEqual([]);
      done();
    });
  });
});
