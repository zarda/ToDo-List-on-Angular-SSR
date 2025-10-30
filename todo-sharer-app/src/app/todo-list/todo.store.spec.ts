import { TestBed } from '@angular/core/testing';
import { TodoStore } from './todo.store';
import { TodoService } from '../todo.service';
import { ListService } from '../list.service';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Timestamp } from '@angular/fire/firestore';

describe('TodoStore', () => {
  let store: TodoStore;
  let todoServiceMock: jasmine.SpyObj<TodoService>;
  let listServiceMock: jasmine.SpyObj<ListService>;
  let authServiceMock: any;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    todoServiceMock = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'addTodo',
      'updateTodo',
      'deleteTodo',
      'updateTodos',
      'deleteTodos'
    ]);
    todoServiceMock.getTodos.and.returnValue(of({ loading: false, data: [] }));

    listServiceMock = jasmine.createSpyObj('ListService', [
      'getLists',
      'addList',
      'updateList',
      'deleteList',
      'deleteListAndTodos',
      'shareList',
      'unshareList'
    ]);
    listServiceMock.getLists.and.returnValue(of({ loading: false, data: [] }));

    authServiceMock = {
      currentUser: signal(null),
      user$: of(null)
    };

    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    snackBarMock.open.and.returnValue({} as any);

    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        TodoStore,
        { provide: TodoService, useValue: todoServiceMock },
        { provide: ListService, useValue: listServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    });

    store = TestBed.inject(TodoStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  // Test all computed properties
  describe('Computed Properties', () => {
    it('should have currentUser', () => {
      expect(store.currentUser).toBeDefined();
    });

    it('should have lists', () => {
      expect(store.lists).toBeDefined();
      expect(store.lists()).toEqual([]);
    });

    it('should have listsLoading', () => {
      expect(store.listsLoading).toBeDefined();
    });

    it('should have selectedListId', () => {
      expect(store.selectedListId).toBeDefined();
    });

    it('should have listSearchTerm', () => {
      expect(store.listSearchTerm).toBeDefined();
    });

    it('should have newListText', () => {
      expect(store.newListText).toBeDefined();
    });

    it('should have isAddingList', () => {
      expect(store.isAddingList).toBeDefined();
    });

    it('should have isEditingList', () => {
      expect(store.isEditingList).toBeDefined();
    });

    it('should have isDeletingList', () => {
      expect(store.isDeletingList).toBeDefined();
    });

    it('should have isSavingList', () => {
      expect(store.isSavingList).toBeDefined();
    });

    it('should have editingListText', () => {
      expect(store.editingListText).toBeDefined();
    });

    it('should have isSharing', () => {
      expect(store.isSharing).toBeDefined();
    });

    it('should have isSharingList', () => {
      expect(store.isSharingList).toBeDefined();
    });

    it('should have shareEmail', () => {
      expect(store.shareEmail).toBeDefined();
    });

    it('should have unsharingEmail', () => {
      expect(store.unsharingEmail).toBeDefined();
    });

    it('should have isSavingTodo', () => {
      expect(store.isSavingTodo).toBeDefined();
    });

    it('should have newTodoText', () => {
      expect(store.newTodoText).toBeDefined();
    });

    it('should have isAddingTodo', () => {
      expect(store.isAddingTodo).toBeDefined();
    });

    it('should have justAddedTodoId', () => {
      expect(store.justAddedTodoId).toBeDefined();
    });

    it('should have sortBy', () => {
      expect(store.sortBy).toBeDefined();
    });

    it('should have todosLoading', () => {
      expect(store.todosLoading).toBeDefined();
    });

    it('should have hideCompleted', () => {
      expect(store.hideCompleted).toBeDefined();
    });

    it('should have searchTerm', () => {
      expect(store.searchTerm).toBeDefined();
    });

    it('should have editingTodoId', () => {
      expect(store.editingTodoId).toBeDefined();
    });

    it('should have editingTodoText', () => {
      expect(store.editingTodoText).toBeDefined();
    });

    it('should have selectedList', () => {
      expect(store.selectedList).toBeDefined();
    });

    it('should have filteredLists', () => {
      expect(store.filteredLists).toBeDefined();
    });

    it('should have todos', () => {
      expect(store.todos).toBeDefined();
    });

    it('should have isFiltered', () => {
      expect(store.isFiltered).toBeDefined();
    });

    it('should have hasCompletedTodos', () => {
      expect(store.hasCompletedTodos).toBeDefined();
    });

    it('should have todoCounts', () => {
      expect(store.todoCounts).toBeDefined();
    });

    it('should have today getter', () => {
      const today = store.today;
      expect(today instanceof Date).toBeTrue();
    });
  });

  // Test all state updater methods
  describe('State Updaters', () => {
    it('should update newTodoText', () => {
      store.setNewTodoText('test todo');
      expect(store.newTodoText()).toBe('test todo');
    });

    it('should update newListText', () => {
      store.setNewListText('test list');
      expect(store.newListText()).toBe('test list');
    });

    it('should update editingListText', () => {
      store.setEditingListText('editing');
      expect(store.editingListText()).toBe('editing');
    });

    it('should update shareEmail', () => {
      store.setShareEmail('test@example.com');
      expect(store.shareEmail()).toBe('test@example.com');
    });

    it('should update searchTerm', () => {
      store.setSearchTerm('search');
      expect(store.searchTerm()).toBe('search');
    });

    it('should update sortBy', () => {
      store.setSortBy('dueDate');
      expect(store.sortBy()).toBe('dueDate');
    });

    it('should update hideCompleted', () => {
      store.setHideCompleted(true);
      expect(store.hideCompleted()).toBeTrue();
    });

    it('should update listSearchTerm', () => {
      store.setListSearchTerm('list search');
      expect(store.listSearchTerm()).toBe('list search');
    });

    it('should update selectedListId', () => {
      store.setSelectedListId('list-123');
      expect(store.selectedListId()).toBe('list-123');
    });

    it('should update editingTodoText', () => {
      store.setEditingTodoText('editing todo');
      expect(store.editingTodoText()).toBe('editing todo');
    });

    it('should clear editing todo', () => {
      store.startEditingTodo('todo-123', 'initial text');
      store.clearEditingTodo();
      expect(store.editingTodoId()).toBeNull();
      expect(store.editingTodoText()).toBe('');
    });

    it('should start editing todo', () => {
      store.startEditingTodo('todo-123', 'initial text');
      expect(store.editingTodoId()).toBe('todo-123');
      expect(store.editingTodoText()).toBe('initial text');
    });
  });

  // Test action methods
  describe('Actions', () => {
    describe('addTodo', () => {
      it('should not add todo if text is empty', async () => {
        store.setNewTodoText('');
        store.setSelectedListId('list-123');
        await store.addTodo();
        expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
      });

      it('should not add todo if no list is selected', async () => {
        store.setNewTodoText('test');
        store.setSelectedListId(null);
        await store.addTodo();
        expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
      });

      it('should add todo when text and list are provided', async () => {
        todoServiceMock.addTodo.and.returnValue(Promise.resolve('new-todo-id'));
        store.setNewTodoText('  test todo  ');
        store.setSelectedListId('list-123');

        await store.addTodo();

        expect(todoServiceMock.addTodo).toHaveBeenCalledWith('list-123', 'test todo');
        expect(store.newTodoText()).toBe('');
      });
    });

    describe('addList', () => {
      it('should not add list if text is empty', async () => {
        authServiceMock.currentUser.set({ uid: 'user-123' });
        store.setNewListText('');
        await store.addList();
        expect(listServiceMock.addList).not.toHaveBeenCalled();
      });

      it('should not add list if no user', async () => {
        authServiceMock.currentUser.set(null);
        store.setNewListText('test list');
        await store.addList();
        expect(listServiceMock.addList).not.toHaveBeenCalled();
      });

      it('should add list when text and user are provided', async () => {
        authServiceMock.currentUser.set({ uid: 'user-123', email: 'test@example.com' });
        listServiceMock.addList.and.returnValue(Promise.resolve('new-list-id'));
        store.setNewListText('  test list  ');

        await store.addList();

        expect(listServiceMock.addList).toHaveBeenCalledWith('user-123', 'test list', {});
        expect(store.newListText()).toBe('');
        expect(store.selectedListId()).toBe('new-list-id');
      });
    });

    describe('startEditList', () => {
      it('should not start edit if no list selected', () => {
        store.setSelectedListId(null);
        store.startEditList();
        expect(store.isEditingList()).toBeFalse();
      });
    });

    describe('cancelEditList', () => {
      it('should cancel edit list', () => {
        store.setEditingListText('test');
        store.cancelEditList();
        expect(store.isEditingList()).toBeFalse();
        expect(store.editingListText()).toBe('');
      });
    });

    describe('saveEditList', () => {
      it('should not save if no list selected', async () => {
        store.setSelectedListId(null);
        store.setEditingListText('new name');
        await store.saveEditList();
        expect(listServiceMock.updateList).not.toHaveBeenCalled();
      });

      it('should not save if text is empty', async () => {
        store.setSelectedListId('list-123');
        store.setEditingListText('  ');
        await store.saveEditList();
        expect(listServiceMock.updateList).not.toHaveBeenCalled();
      });

      it('should save list with new name', async () => {
        listServiceMock.updateList.and.returnValue(Promise.resolve());
        store.setSelectedListId('list-123');
        store.setEditingListText('  new name  ');

        await store.saveEditList();

        expect(listServiceMock.updateList).toHaveBeenCalledWith('list-123', 'new name');
      });
    });

    describe('deleteList', () => {
      it('should not delete if no list selected', async () => {
        store.setSelectedListId(null);
        await store.deleteList();
        expect(dialogMock.open).not.toHaveBeenCalled();
      });

      it('should open confirm dialog for delete', async () => {
        const afterClosedSubject = new Subject();
        const dialogRefMock = {
          afterClosed: () => afterClosedSubject.asObservable()
        } as MatDialogRef<any>;

        dialogMock.open.and.returnValue(dialogRefMock);
        store.setSelectedListId('list-123');

        const deletePromise = store.deleteList();
        afterClosedSubject.next(false);
        afterClosedSubject.complete();

        await deletePromise;
        expect(dialogMock.open).toHaveBeenCalled();
      });
    });

    describe('startSharing', () => {
      it('should start sharing mode', () => {
        store.startSharing();
        expect(store.isSharing()).toBeTrue();
        expect(store.isEditingList()).toBeFalse();
        expect(store.shareEmail()).toBe('');
      });
    });

    describe('cancelSharing', () => {
      it('should cancel sharing mode', () => {
        store.startSharing();
        store.setShareEmail('test@example.com');
        store.cancelSharing();
        expect(store.isSharing()).toBeFalse();
        expect(store.shareEmail()).toBe('');
      });
    });

    describe('shareList', () => {
      it('should not share if no list selected', async () => {
        store.setSelectedListId(null);
        store.setShareEmail('test@example.com');
        await store.shareList();
        expect(listServiceMock.shareList).not.toHaveBeenCalled();
      });

      it('should not share if email is empty', async () => {
        store.setSelectedListId('list-123');
        store.setShareEmail('  ');
        await store.shareList();
        expect(listServiceMock.shareList).not.toHaveBeenCalled();
      });

      it('should share list successfully', async () => {
        listServiceMock.shareList.and.returnValue(Promise.resolve());
        store.setSelectedListId('list-123');
        store.setShareEmail('  test@example.com  ');

        await store.shareList();

        expect(listServiceMock.shareList).toHaveBeenCalledWith('list-123', { 'test@example.com': true });
        expect(snackBarMock.open).toHaveBeenCalled();
      });

      it('should handle share error', async () => {
        listServiceMock.shareList.and.returnValue(Promise.reject(new Error('User not found')));
        store.setSelectedListId('list-123');
        store.setShareEmail('test@example.com');

        await store.shareList();

        expect(snackBarMock.open).toHaveBeenCalled();
      });
    });

    describe('unshareList', () => {
      it('should not unshare if no list selected', async () => {
        store.setSelectedListId(null);
        await store.unshareList('test@example.com');
        expect(listServiceMock.unshareList).not.toHaveBeenCalled();
      });

      it('should unshare list successfully', async () => {
        listServiceMock.unshareList.and.returnValue(Promise.resolve());
        store.setSelectedListId('list-123');

        await store.unshareList('test@example.com');

        expect(listServiceMock.unshareList).toHaveBeenCalledWith('list-123', 'test@example.com');
        expect(snackBarMock.open).toHaveBeenCalled();
      });

      it('should handle unshare error', async () => {
        listServiceMock.unshareList.and.returnValue(Promise.reject(new Error('Failed')));
        store.setSelectedListId('list-123');

        await store.unshareList('test@example.com');

        expect(snackBarMock.open).toHaveBeenCalled();
      });
    });

    describe('deleteTodo', () => {
      it('should not delete if no list selected', async () => {
        await store.deleteTodo('todo-123');
        expect(dialogMock.open).not.toHaveBeenCalled();
      });
    });

    describe('toggleTodoCompletion', () => {
      it('should not toggle if no list selected', async () => {
        await store.toggleTodoCompletion({ todoId: 'todo-123', completed: true });
        expect(todoServiceMock.updateTodo).not.toHaveBeenCalled();
      });
    });

    describe('saveEditedTodoText', () => {
      it('should not save if no list selected', async () => {
        store.setSelectedListId(null);
        await store.saveEditedTodoText();
        expect(todoServiceMock.updateTodo).not.toHaveBeenCalled();
      });

      it('should not save if no todo editing', async () => {
        store.setSelectedListId('list-123');
        await store.saveEditedTodoText();
        expect(todoServiceMock.updateTodo).not.toHaveBeenCalled();
      });

      it('should not save if text is empty', async () => {
        store.setSelectedListId('list-123');
        store.startEditingTodo('todo-123', 'original');
        store.setEditingTodoText('  ');
        await store.saveEditedTodoText();
        expect(todoServiceMock.updateTodo).not.toHaveBeenCalled();
      });
    });

    describe('updateDueDate', () => {
      it('should not update if no list selected', async () => {
        store.setSelectedListId(null);
        await store.updateDueDate({ todoId: 'todo-123', dueDate: new Date() });
        expect(todoServiceMock.updateTodo).not.toHaveBeenCalled();
      });
    });

    describe('drop', () => {
      it('should not drop if no list selected', async () => {
        store.setSelectedListId(null);
        const event = {} as CdkDragDrop<any[]>;
        await store.drop(event);
        expect(todoServiceMock.updateTodos).not.toHaveBeenCalled();
      });
    });
  });
});
