import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { TodoService } from './todo.service';
import { AuthService } from './auth/auth.service';
import { User } from './user';

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

  describe('authService integration', () => {
    it('should have access to authService', () => {
      expect(authServiceMock.currentUser).toBeDefined();
    });
  });

  describe('Service methods', () => {
    it('should have getTodos method', () => {
      expect(typeof service.getTodos).toBe('function');
    });

    it('should have addTodo method', () => {
      expect(typeof service.addTodo).toBe('function');
    });

    it('should have updateTodo method', () => {
      expect(typeof service.updateTodo).toBe('function');
    });

    it('should have deleteTodo method', () => {
      expect(typeof service.deleteTodo).toBe('function');
    });

    it('should have updateTodos method', () => {
      expect(typeof service.updateTodos).toBe('function');
    });

    it('should have deleteAllTodos method', () => {
      expect(typeof service.deleteAllTodos).toBe('function');
    });

    it('should have deleteTodos method', () => {
      expect(typeof service.deleteTodos).toBe('function');
    });
  });
});
