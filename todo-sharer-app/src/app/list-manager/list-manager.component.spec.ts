import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListManagerComponent } from './list-manager.component';
import { TodoStore } from '../todo-list/todo.store';
import { signal } from '@angular/core';

describe('ListManagerComponent', () => {
  let component: ListManagerComponent;
  let fixture: ComponentFixture<ListManagerComponent>;
  let mockStore: Partial<TodoStore>;

  beforeEach(async () => {
    mockStore = {
      listSearchTerm: signal(''),
      setListSearchTerm: jasmine.createSpy('setListSearchTerm'),
      selectedListId: signal(null),
      setSelectedListId: jasmine.createSpy('setSelectedListId'),
      isEditingList: signal(false),
      startEditList: jasmine.createSpy('startEditList'),
      deleteList: jasmine.createSpy('deleteList').and.resolveTo(),
      isDeletingList: signal(false),
      editingListText: signal(''),
      setEditingListText: jasmine.createSpy('setEditingListText'),
      saveEditList: jasmine.createSpy('saveEditList').and.resolveTo(),
      isSavingList: signal(false),
      cancelEditList: jasmine.createSpy('cancelEditList'),
      filteredLists: signal([]),
      newListText: signal(''),
      setNewListText: jasmine.createSpy('setNewListText'),
      addList: jasmine.createSpy('addList').and.resolveTo(),
      isAddingList: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [ListManagerComponent],
      providers: [
        { provide: TodoStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListManagerComponent);
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
