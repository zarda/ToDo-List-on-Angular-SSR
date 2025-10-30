import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharingManagerComponent } from './sharing-manager.component';
import { TodoStore } from '../todo-list/todo.store';
import { signal } from '@angular/core';

describe('SharingManagerComponent', () => {
  let component: SharingManagerComponent;
  let fixture: ComponentFixture<SharingManagerComponent>;
  let mockStore: Partial<TodoStore>;

  beforeEach(async () => {
    mockStore = {
      selectedList: signal(null),
      currentUser: signal(null),
      unsharingEmail: signal(null),
      unshareList: jasmine.createSpy('unshareList').and.resolveTo(),
      isSharing: signal(false),
      shareEmail: signal(''),
      setShareEmail: jasmine.createSpy('setShareEmail'),
      shareList: jasmine.createSpy('shareList').and.resolveTo(),
      isSharingList: signal(false),
      cancelSharing: jasmine.createSpy('cancelSharing'),
      startSharing: jasmine.createSpy('startSharing'),
    };

    await TestBed.configureTestingModule({
      imports: [SharingManagerComponent],
      providers: [
        { provide: TodoStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TodoStore', () => {
    expect(component['store']).toBe(mockStore as TodoStore);
  });

  it('should have access to store methods', () => {
    expect(component['store']).toBeDefined();
    expect(typeof component['store']).toBe('object');
  });
});
