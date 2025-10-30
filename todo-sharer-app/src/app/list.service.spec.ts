import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ListService } from './list.service';

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
});
