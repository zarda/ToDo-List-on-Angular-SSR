import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoControlsComponent } from './todo-controls.component';
import { TodoStore } from '../todo-list/todo.store';
import { signal } from '@angular/core';

describe('TodoControlsComponent', () => {
  let component: TodoControlsComponent;
  let fixture: ComponentFixture<TodoControlsComponent>;
  let mockStore: Partial<TodoStore>;

  beforeEach(async () => {
    mockStore = {
      todos: signal([]),
      searchTerm: signal(''),
      setSearchTerm: jasmine.createSpy('setSearchTerm'),
      hideCompleted: signal(false),
      setHideCompleted: jasmine.createSpy('setHideCompleted'),
      sortBy: signal('order' as const),
      setSortBy: jasmine.createSpy('setSortBy'),
      hasCompletedTodos: signal(false),
      clearCompleted: jasmine.createSpy('clearCompleted').and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [TodoControlsComponent],
      providers: [
        { provide: TodoStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoControlsComponent);
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
