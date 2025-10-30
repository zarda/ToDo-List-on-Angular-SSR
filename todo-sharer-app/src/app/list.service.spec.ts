import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ListService } from './list.service';
import { User } from './user';

describe('ListService', () => {
  let service: ListService;
  let firestoreMock: Partial<Firestore>;

  beforeEach(() => {
    firestoreMock = { app: {} as any };

    TestBed.configureTestingModule({
      providers: [
        ListService,
        { provide: Firestore, useValue: firestoreMock }
      ]
    });

    service = TestBed.inject(ListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty data when no user is provided', (done) => {
    service.getLists(null as any).subscribe(result => {
      expect(result.loading).toBeFalse();
      expect(result.data).toEqual([]);
      done();
    });
  });

  describe('Service configuration', () => {
    it('should have firestore configured', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Service methods', () => {
    it('should have getLists method', () => {
      expect(typeof service.getLists).toBe('function');
    });

    it('should have addList method', () => {
      expect(typeof service.addList).toBe('function');
    });

    it('should have updateList method', () => {
      expect(typeof service.updateList).toBe('function');
    });

    it('should have deleteList method', () => {
      expect(typeof service.deleteList).toBe('function');
    });

    it('should have deleteListAndTodos method', () => {
      expect(typeof service.deleteListAndTodos).toBe('function');
    });

    it('should have shareList method', () => {
      expect(typeof service.shareList).toBe('function');
    });

    it('should have unshareList method', () => {
      expect(typeof service.unshareList).toBe('function');
    });
  });
});
