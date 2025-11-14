import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { TodoService } from './todo.service';
import { AuthService } from './auth.service';
import { User } from '../user';

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

  describe('getTodos', () => {
    it('should return empty data when no listId is provided', (done) => {
      service.getTodos('', 'order', 'asc').subscribe(result => {
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should accept "order" as sortBy parameter with "asc" direction', (done) => {
      service.getTodos('', 'order', 'asc').subscribe(result => {
        expect(result).toBeDefined();
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should accept "dueDate" as sortBy parameter with "asc" direction', (done) => {
      service.getTodos('', 'dueDate', 'asc').subscribe(result => {
        expect(result).toBeDefined();
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should accept "createdAt" as sortBy parameter with "desc" direction', (done) => {
      service.getTodos('', 'createdAt', 'desc').subscribe(result => {
        expect(result).toBeDefined();
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should accept "createdAt" as sortBy parameter with "asc" direction', (done) => {
      service.getTodos('', 'createdAt', 'asc').subscribe(result => {
        expect(result).toBeDefined();
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should accept "dueDate" as sortBy parameter with "desc" direction', (done) => {
      service.getTodos('', 'dueDate', 'desc').subscribe(result => {
        expect(result).toBeDefined();
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should return empty data when listId is null', (done) => {
      service.getTodos(null as any, 'order', 'asc').subscribe(result => {
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should return empty data when listId is undefined', (done) => {
      service.getTodos(undefined as any, 'order', 'asc').subscribe(result => {
        expect(result.loading).toBeFalse();
        expect(result.data).toEqual([]);
        done();
      });
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
