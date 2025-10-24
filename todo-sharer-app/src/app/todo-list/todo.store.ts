import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, filter } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Timestamp } from '@angular/fire/firestore';

import { TodoService } from '../todo.service';
import { Todo } from '../models/todo.model';
import { ListService } from '../list.service';
import { List } from '../list';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog.component';

interface TodoState {
  lists: List[];
  todos: Todo[];
  listsLoading: boolean;
  todosLoading: boolean;
  selectedListId: string | null;
  listSearchTerm: string;
  newListText: string;
  isAddingList: boolean;
  isEditingList: boolean;
  isDeletingList: boolean;
  isSavingList: boolean;
  editingListText: string;
  isSharing: boolean;
  isSharingList: boolean;
  shareEmail: string;
  unsharingEmail: string | null;
  isSavingTodo: boolean;
  newTodoText: string;
  isAddingTodo: boolean;
  justAddedTodoId: string | null;
  sortBy: 'order' | 'dueDate' | 'createdAt';
  hideCompleted: boolean;
  searchTerm: string;
  editingTodoId: string | null;
  editingTodoText: string;
}

@Injectable()
export class TodoStore {
  // Service Dependencies
  private readonly todoService = inject(TodoService);
  private readonly listService = inject(ListService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private readonly state = signal<TodoState>({
    lists: [],
    todos: [],
    listsLoading: true,
    todosLoading: true,
    selectedListId: null,
    listSearchTerm: '',
    newListText: '',
    isAddingList: false,
    isEditingList: false,
    isDeletingList: false,
    isSavingList: false,
    editingListText: '',
    isSharing: false,
    isSharingList: false,
    shareEmail: '',
    unsharingEmail: null,
    isSavingTodo: false,
    newTodoText: '',
    isAddingTodo: false,
    justAddedTodoId: null,
    sortBy: 'order',
    hideCompleted: false,
    searchTerm: '',
    editingTodoId: null,
    editingTodoText: '',
  });

  // Selectors
  readonly currentUser = this.authService.currentUser;
  readonly lists = computed(() => this.state().lists);
  readonly listsLoading = computed(() => this.state().listsLoading);
  readonly selectedListId = computed(() => this.state().selectedListId);
  readonly listSearchTerm = computed(() => this.state().listSearchTerm);
  readonly newListText = computed(() => this.state().newListText);
  readonly isAddingList = computed(() => this.state().isAddingList);
  readonly isEditingList = computed(() => this.state().isEditingList);
  readonly isDeletingList = computed(() => this.state().isDeletingList);
  readonly isSavingList = computed(() => this.state().isSavingList);
  readonly editingListText = computed(() => this.state().editingListText);
  readonly isSharing = computed(() => this.state().isSharing);
  readonly isSharingList = computed(() => this.state().isSharingList);
  readonly shareEmail = computed(() => this.state().shareEmail);
  readonly unsharingEmail = computed(() => this.state().unsharingEmail);
  readonly isSavingTodo = computed(() => this.state().isSavingTodo);
  readonly newTodoText = computed(() => this.state().newTodoText);
  readonly isAddingTodo = computed(() => this.state().isAddingTodo);
  readonly justAddedTodoId = computed(() => this.state().justAddedTodoId);
  readonly sortBy = computed(() => this.state().sortBy);
  readonly todosLoading = computed(() => this.state().todosLoading);
  readonly hideCompleted = computed(() => this.state().hideCompleted);
  readonly searchTerm = computed(() => this.state().searchTerm);
  readonly editingTodoId = computed(() => this.state().editingTodoId);
  readonly editingTodoText = computed(() => this.state().editingTodoText);

  readonly selectedList = computed(() => {
    const listId = this.selectedListId();
    if (!listId) return null;
    return this.lists().find(l => l.id === listId) ?? null;
  });

  readonly filteredLists = computed(() => {
    const lists = this.lists();
    const term = this.listSearchTerm().toLowerCase();
    if (!term) return lists;
    return lists.filter(list => list.name.toLowerCase().includes(term));
  });

  private readonly allTodos = computed(() => this.state().todos);

  readonly todos = computed(() => {
    const all = this.allTodos();
    const term = this.searchTerm().toLowerCase();
    const hide = this.hideCompleted();

    const filtered = all.filter(todo => {
      const matchesSearch = !term || todo.text.toLowerCase().includes(term);
      const matchesCompletion = !hide || !todo.completed;
      return matchesSearch && matchesCompletion;
    });

    return filtered;
  });

  readonly isFiltered = computed(() => {
    const state = this.state();
    // The list is considered filtered if a search term is active or if completed items are hidden.
    return !!state.searchTerm || state.hideCompleted;
  });

  readonly hasCompletedTodos = computed(() => this.allTodos().some(t => t.completed));
  readonly todoCounts = computed(() => {
    const all = this.allTodos();
    const total = all.length;
    const active = all.filter(t => !t.completed).length;
    return { active, total };
  });

  // Make `today` a getter to ensure it's always current.
  get today(): Date {
    return new Date();
  }

  constructor() {
    this.initializeEffects();
  }

  private initializeEffects(): void {
    this.loadListsOnUserChange();
    this.loadTodosOnSelectionChange();
    this.handleAutoSelectList();
  }

  // --- State Updaters for UI bindings ---
  readonly setNewTodoText = (newTodoText: string) => this.state.update(s => ({ ...s, newTodoText }));
  readonly setNewListText = (newListText: string) => this.state.update(s => ({ ...s, newListText }));
  readonly setEditingListText = (editingListText: string) => this.state.update(s => ({ ...s, editingListText }));
  readonly setShareEmail = (shareEmail: string) => this.state.update(s => ({ ...s, shareEmail }));
  readonly setSearchTerm = (searchTerm: string) => this.state.update(s => ({ ...s, searchTerm }));
  readonly setSortBy = (sortBy: 'order' | 'dueDate' | 'createdAt') => this.state.update(s => ({ ...s, sortBy }));
  readonly setHideCompleted = (hideCompleted: boolean) => this.state.update(s => ({ ...s, hideCompleted }));
  readonly setListSearchTerm = (listSearchTerm: string) => this.state.update(s => ({ ...s, listSearchTerm }));
  readonly setSelectedListId = (selectedListId: string | null) => this.state.update(s => ({ ...s, selectedListId }));
  readonly setEditingTodoText = (editingTodoText: string) => this.state.update(s => ({ ...s, editingTodoText }));
  readonly clearEditingTodo = () => this.state.update(s => ({ ...s, editingTodoId: null, editingTodoText: '' }));
  readonly startEditingTodo = (todoId: string, initialText: string) => {
    this.state.update(s => ({ ...s, editingTodoId: todoId, editingTodoText: initialText }));
  };

  // Helper to manage loading states for async operations
  private async withLoading(
    flagName: keyof TodoState,
    operation: () => Promise<any>
  ): Promise<void> {
    this.state.update(s => ({ ...s, [flagName]: true }));
    try {
      await operation();
    } finally {
      this.state.update(s => ({ ...s, [flagName]: false }));
    }
  }

  // Helper for optimistic updates on the todos array
  private async _withOptimisticTodoUpdate(
    updateFn: (todos: Todo[]) => Todo[],
    operation: () => Promise<any>,
    config: { successMsg?: string; errorMsg: string }
  ): Promise<void> {
    const originalTodos = this.allTodos();
    this.state.update(s => ({ ...s, todos: updateFn(originalTodos) }));

    try {
      await operation();
      if (config.successMsg) {
        this.snackBar.open(config.successMsg, 'Close', { duration: 2000 });
      }
    } catch (error) {
      console.error(config.errorMsg, error);
      this.snackBar.open(config.errorMsg, 'Close', { duration: 4000 });
      this.state.update(s => ({ ...s, todos: originalTodos })); // Revert on failure
    }
  }

  // --- Effects ---

  private loadListsOnUserChange(): void {
    const listsResult$ = toObservable(this.currentUser).pipe(
      switchMap(user =>
        user ? this.listService.getLists(user) : of({ loading: false, data: [] as List[] })
      )
    );
    const listsResultSignal = toSignal(listsResult$, { initialValue: { loading: true, data: [] } });
    effect(() => {
      const result = listsResultSignal();
      if (result) {
        this.state.update(s => ({ ...s, lists: result.data, listsLoading: result.loading }));
      }
    });
  }

  private loadTodosOnSelectionChange(): void {
    const todosResult$ = combineLatest([
      toObservable(this.selectedListId),
      toObservable(this.sortBy)
    ]).pipe(
      switchMap(([listId, sortBy]) => {
        if (!listId) return of({ loading: false, data: [] as Todo[] });
        const direction = sortBy === 'createdAt' ? 'desc' : 'asc';
        return this.todoService.getTodos(listId, sortBy, direction);
      })
    );
    const todosResultSignal = toSignal(todosResult$, { initialValue: { loading: true, data: [] } });
    effect(() => {
      const result = todosResultSignal();
      if (result) {
        this.state.update(s => ({ ...s, todos: result.data, todosLoading: result.loading }));
      }
    });
  }

  private handleAutoSelectList(): void {
    effect(() => {
      // Trigger this effect when the user or the lists change.
      this.currentUser();
      const availableLists = this.lists();
      const currentSelection = this.selectedListId();

      if (availableLists.length === 0) {
        this.setSelectedListId(null);
      } else if (!currentSelection || !availableLists.find(l => l.id === currentSelection)) {
        this.setSelectedListId(availableLists[0].id);
      }
    });
  }

  async addTodo(): Promise<void> {
    const text = this.newTodoText().trim();
    const listId = this.selectedListId();
    if (text && listId) {
      await this.withLoading('isAddingTodo', async () => {
        const newTodoId = await this.todoService.addTodo(listId, text);
        this.setNewTodoText('');
        // Flash the new item
        this.state.update(s => ({ ...s, justAddedTodoId: newTodoId }));
        // Reset after animation
        setTimeout(() => this.state.update(s => ({ ...s, justAddedTodoId: null })), 1500);
      });
    }
  }

  async addList(): Promise<void> {
    const text = this.newListText().trim();
    const currentUser = this.currentUser();
    if (text && currentUser) {
      await this.withLoading('isAddingList', async () => {
        const newListId = await this.listService.addList(currentUser.uid, text);
        this.setSelectedListId(newListId);
        this.setNewListText('');
      });
    }
  }

  startEditList(): void {
    const listId = this.selectedListId();
    const list = this.lists().find(l => l.id === listId);
    if (list) {
      this.setEditingListText(list.name);
      this.state.update(s => ({ ...s, isEditingList: true, isSharing: false }));
    }
  }

  cancelEditList(): void {
    this.state.update(s => ({ ...s, isEditingList: false }));
    this.setEditingListText('');
  }

  async saveEditList(): Promise<void> {
    const listId = this.selectedListId();
    const newName = this.editingListText().trim();
    if (listId && newName) {
      await this.withLoading('isSavingList', async () => {
        await this.listService.updateList(listId, newName);
        this.state.update(s => ({ ...s, isEditingList: false }));
      });
    }
  }

  async deleteList(): Promise<void> {
    const listId = this.selectedListId();
    if (!listId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete List',
        message: 'Are you sure you want to delete this list? This action cannot be undone.'
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed().pipe(filter(res => !!res)));
    if (result) {
      await this.withLoading('isDeletingList', async () => {
        await this.listService.deleteListAndTodos(listId);
        this.state.update(s => ({ ...s, isEditingList: false }));
        this.snackBar.open('List deleted.', 'Close', { duration: 3000 });
      });
    }
  }

  startSharing(): void {
    this.state.update(s => ({ ...s, isSharing: true, isEditingList: false }));
    this.setShareEmail('');
  }

  cancelSharing(): void {
    this.state.update(s => ({ ...s, isSharing: false }));
    this.setShareEmail('');
  }

  async shareList(): Promise<void> {
    const listId = this.selectedListId();
    const email = this.shareEmail().trim();
    if (!listId || !email) return;

    await this.withLoading('isSharingList', async () => {
      try {
        await this.listService.shareList(listId, email);
        this.snackBar.open(`List shared with ${email}!`, 'Close', { duration: 3000 });
        this.cancelSharing();
      } catch (error: any) {
        console.error('Failed to share list:', error);
        const errorMessage = error.message || 'Could not share the list. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  async unshareList(email: string): Promise<void> {
    const listId = this.selectedListId();
    if (!listId) return;

    this.state.update(s => ({ ...s, unsharingEmail: email }));
    try {
      await this.listService.unshareList(listId, email);
      this.snackBar.open(`Stopped sharing list with ${email}.`, 'Close', { duration: 3000 });
    } catch (error: any) {
      console.error('Failed to unshare list:', error);
      const errorMessage = error.message || 'Could not unshare the list. Please try again.';
      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
    } finally {
      this.state.update(s => ({ ...s, unsharingEmail: null }));
    }
  }

  async deleteTodo(todoId: string): Promise<void> {
    const listId = this.selectedListId();
    const todoToDelete = this.allTodos().find(t => t.id === todoId);
    if (!listId || !todoToDelete) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete To-Do',
        message: 'Are you sure you want to delete this to-do?'
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed().pipe(filter(res => !!res)));
    if (result) {
      await this._withOptimisticTodoUpdate(
        (todos) => todos.filter(t => t.id !== todoId),
        () => this.todoService.deleteTodo(listId, todoId),
        { errorMsg: 'Failed to delete to-do. Please try again.' }
      );
    }
  }

  async toggleTodoCompletion({ todoId, completed }: { todoId: string; completed: boolean }): Promise<void> {
    const listId = this.selectedListId();
    if (!listId) return;

    const todoToUpdate = this.allTodos().find(t => t.id === todoId);
    if (!todoToUpdate) return;

    await this._withOptimisticTodoUpdate(
      (todos) => todos.map(t => t.id === todoId ? { ...t, completed } : t),
      () => this.todoService.updateTodo(listId, { id: todoId, completed }),
      { errorMsg: 'Failed to update to-do status. Please try again.' }
    );
  }

  async saveEditedTodoText(): Promise<void> {
    const listId = this.selectedListId();
    const todoId = this.editingTodoId();
    const newText = this.editingTodoText().trim();
    if (!listId || !todoId || !newText) return;

    const todoToUpdate = this.allTodos().find(t => t.id === todoId);
    if (!todoToUpdate || todoToUpdate.text === newText) {
      this.clearEditingTodo(); // No change or invalid, just clear editing state
      return;
    }

    await this.withLoading('isSavingTodo', async () => {
      await this._withOptimisticTodoUpdate(
        (todos) => todos.map(t => t.id === todoId ? { ...t, text: newText } : t),
        async () => {
          await this.todoService.updateTodo(listId, { id: todoId, text: newText });
          this.clearEditingTodo();
        },
        { errorMsg: 'Failed to save to-do. Please try again.' }
      );
    });
  }

  async updateDueDate({ todoId, dueDate }: { todoId: string; dueDate: Date | null }): Promise<void> {
    const listId = this.selectedListId();
    if (!listId) return;

    const todoToUpdate = this.allTodos().find(t => t.id === todoId);
    if (!todoToUpdate) return;

    const newDueDate = dueDate ? Timestamp.fromDate(dueDate) : null;

    await this._withOptimisticTodoUpdate(
      (todos) => todos.map(t => t.id === todoId ? { ...t, dueDate: newDueDate } : t),
      () => this.todoService.updateTodo(listId, { id: todoId, dueDate: newDueDate }),
      {
        successMsg: 'Due date updated.',
        errorMsg: 'Failed to update due date. Please try again.'
      }
    );
  }

  async clearCompleted(): Promise<void> {
    const listId = this.selectedListId();
    if (!listId) return;

    const completedIds = this.allTodos().filter(t => t.completed).map(t => t.id);
    if (completedIds.length === 0) {
      this.snackBar.open('No completed to-dos to clear.', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Clear Completed To-Dos',
        message: `Are you sure you want to permanently delete ${completedIds.length} completed to-do(s)?`
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed().pipe(filter(res => !!res)));
    if (result) {
      await this._withOptimisticTodoUpdate(
        (todos) => todos.filter(t => !t.completed),
        () => this.todoService.deleteTodos(listId, completedIds),
        {
          successMsg: 'Completed to-dos cleared.',
          errorMsg: 'Failed to clear completed to-dos.'
        }
      );
    }
  }

  async drop(event: CdkDragDrop<Todo[]>): Promise<void> {
    const listId = this.selectedListId();
    if (!listId) return;

    await this._withOptimisticTodoUpdate(
      (currentTodos) => {
        const allTodosCopy = [...currentTodos];
        const visibleTodos = this.todos(); // Use the computed visible todos

        const itemToMove = visibleTodos[event.previousIndex];
        const fromIndex = allTodosCopy.findIndex(t => t.id === itemToMove.id);
        let toIndex = allTodosCopy.findIndex(t => t.id === visibleTodos[event.currentIndex].id);

        if (event.previousIndex < event.currentIndex) {
          toIndex++;
        }
        moveItemInArray(allTodosCopy, fromIndex, toIndex);
        return allTodosCopy;
      },
      async () => {
        const updates = this.allTodos().map((todo, index) => ({
          id: todo.id,
          order: (index + 1) * 1000, // Re-space all items
        }));
        await this.todoService.updateTodos(listId, updates);
      },
      { errorMsg: 'Could not save new order. Please try again.' }
    );
  }
}