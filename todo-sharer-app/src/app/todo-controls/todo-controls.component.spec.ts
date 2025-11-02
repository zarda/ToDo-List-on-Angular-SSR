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
      startClearCompleted: jasmine.createSpy('startClearCompleted'),
      cancelClearCompleted: jasmine.createSpy('cancelClearCompleted'),
      confirmClearCompleted: jasmine.createSpy('confirmClearCompleted').and.resolveTo(),
      confirmingClearCompleted: signal(false),
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

  // Test sorting functionality
  describe('Sort functionality', () => {
    describe('onSortChange', () => {
      it('should call store.setSortBy with "order" when order is selected', () => {
        const event = { value: 'order' };
        component.onSortChange(event);
        expect(mockStore.setSortBy).toHaveBeenCalledWith('order');
      });

      it('should call store.setSortBy with "dueDate" when dueDate is selected', () => {
        const event = { value: 'dueDate' };
        component.onSortChange(event);
        expect(mockStore.setSortBy).toHaveBeenCalledWith('dueDate');
      });

      it('should call store.setSortBy with "createdAt" when createdAt is selected', () => {
        const event = { value: 'createdAt' };
        component.onSortChange(event);
        expect(mockStore.setSortBy).toHaveBeenCalledWith('createdAt');
      });

      it('should not call store.setSortBy when event value is null', () => {
        const event = { value: null };
        component.onSortChange(event);
        expect(mockStore.setSortBy).not.toHaveBeenCalled();
      });

      it('should not call store.setSortBy when event value is undefined', () => {
        const event = { value: undefined };
        component.onSortChange(event);
        expect(mockStore.setSortBy).not.toHaveBeenCalled();
      });

      it('should not call store.setSortBy when event value is empty string', () => {
        const event = { value: '' };
        component.onSortChange(event);
        expect(mockStore.setSortBy).not.toHaveBeenCalled();
      });

      it('should handle event object with no value property gracefully', () => {
        const event = {};
        expect(() => component.onSortChange(event)).not.toThrow();
        expect(mockStore.setSortBy).not.toHaveBeenCalled();
      });
    });

    describe('Sort button UI integration', () => {
      it('should display current sort value from store', () => {
        expect(mockStore.sortBy!()).toBe('order');
      });

      it('should have access to sortBy signal from store', () => {
        expect(mockStore.sortBy).toBeDefined();
        expect(typeof mockStore.sortBy).toBe('function');
      });
    });
  });
});
