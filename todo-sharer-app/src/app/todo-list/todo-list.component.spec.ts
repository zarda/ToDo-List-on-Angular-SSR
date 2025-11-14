import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoStore } from './todo.store';
import { TodoService } from '../services/todo.service';
import { ListService } from '../services/list.service';
import { AuthService } from '../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let storeStub: Partial<TodoStore>;

  beforeEach(async () => {
    // Create a stub for TodoStore with minimal required properties
    storeStub = {
      currentUser: signal(null),
      lists: signal([]),
      listsLoading: signal(false),
      todos: signal([]),
      todosLoading: signal(false),
      selectedListId: signal(null),
      selectedList: signal(null),
      filteredLists: signal([]),
      listSearchTerm: signal(''),
      newListText: signal(''),
      isAddingList: signal(false),
      isEditingList: signal(false),
      isDeletingList: signal(false),
      isSavingList: signal(false),
      editingListText: signal(''),
      isSharing: signal(false),
      isSharingList: signal(false),
      shareEmail: signal(''),
      unsharingEmail: signal(null),
      isSavingTodo: signal(false),
      newTodoText: signal(''),
      isAddingTodo: signal(false),
      justAddedTodoId: signal(null),
      sortBy: signal('order' as const),
      hideCompleted: signal(false),
      searchTerm: signal(''),
      editingTodoId: signal(null),
      editingTodoText: signal(''),
      isFiltered: signal(false),
      hasCompletedTodos: signal(false),
      todoCounts: signal({ active: 0, total: 0 }),
      setNewTodoText: jasmine.createSpy('setNewTodoText'),
      setNewListText: jasmine.createSpy('setNewListText'),
      setEditingListText: jasmine.createSpy('setEditingListText'),
      setShareEmail: jasmine.createSpy('setShareEmail'),
      setSearchTerm: jasmine.createSpy('setSearchTerm'),
      setSortBy: jasmine.createSpy('setSortBy'),
      setHideCompleted: jasmine.createSpy('setHideCompleted'),
      setListSearchTerm: jasmine.createSpy('setListSearchTerm'),
      setSelectedListId: jasmine.createSpy('setSelectedListId'),
      setEditingTodoText: jasmine.createSpy('setEditingTodoText'),
      clearEditingTodo: jasmine.createSpy('clearEditingTodo'),
      startEditingTodo: jasmine.createSpy('startEditingTodo'),
      addTodo: jasmine.createSpy('addTodo').and.resolveTo(),
      addList: jasmine.createSpy('addList').and.resolveTo(),
      startEditList: jasmine.createSpy('startEditList'),
      cancelEditList: jasmine.createSpy('cancelEditList'),
      saveEditList: jasmine.createSpy('saveEditList').and.resolveTo(),
      startDeleteList: jasmine.createSpy('startDeleteList'),
      cancelDeleteList: jasmine.createSpy('cancelDeleteList'),
      confirmDeleteList: jasmine.createSpy('confirmDeleteList').and.resolveTo(),
      confirmingDeleteListId: signal(null),
      confirmingDeleteTodoId: signal(null),
      confirmingClearCompleted: signal(false),
      startSharing: jasmine.createSpy('startSharing'),
      cancelSharing: jasmine.createSpy('cancelSharing'),
      shareList: jasmine.createSpy('shareList').and.resolveTo(),
      unshareList: jasmine.createSpy('unshareList').and.resolveTo(),
      startDeleteTodo: jasmine.createSpy('startDeleteTodo'),
      cancelDeleteTodo: jasmine.createSpy('cancelDeleteTodo'),
      confirmDeleteTodo: jasmine.createSpy('confirmDeleteTodo').and.resolveTo(),
      toggleTodoCompletion: jasmine.createSpy('toggleTodoCompletion').and.resolveTo(),
      saveEditedTodoText: jasmine.createSpy('saveEditedTodoText').and.resolveTo(),
      updateDueDate: jasmine.createSpy('updateDueDate').and.resolveTo(),
      startClearCompleted: jasmine.createSpy('startClearCompleted'),
      cancelClearCompleted: jasmine.createSpy('cancelClearCompleted'),
      confirmClearCompleted: jasmine.createSpy('confirmClearCompleted').and.resolveTo(),
      drop: jasmine.createSpy('drop').and.resolveTo(),
      today: new Date()
    };

    const firestoreMock = { app: {} as any };
    const todoServiceMock = jasmine.createSpyObj('TodoService', ['getTodos', 'addTodo', 'updateTodo', 'deleteTodo']);
    todoServiceMock.getTodos.and.returnValue(of({ loading: false, data: [] }));
    const listServiceMock = jasmine.createSpyObj('ListService', ['getLists']);
    listServiceMock.getLists.and.returnValue(of({ loading: false, data: [] }));
    const authServiceMock = { currentUser: signal(null), user$: of(null) };

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoStore, useValue: storeStub },
        { provide: Firestore, useValue: firestoreMock },
        { provide: TodoService, useValue: todoServiceMock },
        { provide: ListService, useValue: listServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have access to the store', () => {
    expect(component['store']).toBeTruthy();
  });

  it('should initialize with the provided store', () => {
    expect(component['store']).toBeTruthy();
  });

  it('should have TodoStore instance available', () => {
    expect(component['store']).toBeTruthy();
    expect(typeof component['store']).toBe('object');
  });

  it('should have access to store signals', () => {
    expect(component['store'].todos).toBeDefined();
    expect(component['store'].lists).toBeDefined();
    expect(component['store'].selectedListId).toBeDefined();
  });

  it('should have access to store loading states', () => {
    expect(component['store'].todosLoading).toBeDefined();
    expect(component['store'].listsLoading).toBeDefined();
    expect(component['store'].isSavingTodo).toBeDefined();
  });

  it('should provide TodoStore to child components', () => {
    const providers = fixture.debugElement.injector.get(TodoStore);
    expect(providers).toBeTruthy();
  });

  it('should render without errors when store has empty data', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should have access to store todo management methods', () => {
    expect(component['store'].addTodo).toBeDefined();
    expect(component['store'].startDeleteTodo).toBeDefined();
    expect(component['store'].confirmDeleteTodo).toBeDefined();
    expect(component['store'].toggleTodoCompletion).toBeDefined();
  });

  it('should have access to store list management methods', () => {
    expect(component['store'].addList).toBeDefined();
    expect(component['store'].startDeleteList).toBeDefined();
    expect(component['store'].confirmDeleteList).toBeDefined();
    expect(component['store'].setSelectedListId).toBeDefined();
  });

  it('should have access to store filtering and sorting methods', () => {
    expect(component['store'].setSearchTerm).toBeDefined();
    expect(component['store'].setSortBy).toBeDefined();
    expect(component['store'].setHideCompleted).toBeDefined();
  });

  it('should have access to store sharing methods', () => {
    expect(component['store'].shareList).toBeDefined();
    expect(component['store'].unshareList).toBeDefined();
  });

  it('should have drag-drop functionality available', () => {
    expect(component['store'].drop).toBeDefined();
  });
});
