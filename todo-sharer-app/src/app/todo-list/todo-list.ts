import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms'; 
import { Auth, user } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { ListService } from '../list.service';
import { List } from '../list';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoList {
  private readonly todoService = inject(TodoService);
  private readonly listService = inject(ListService);
  private readonly auth: Auth = inject(Auth);
  private readonly user = toSignal(user(this.auth));

  // List management signals
  private readonly lists$ = toObservable(this.user).pipe(
    switchMap(user =>
      user ? this.listService.getLists(user.uid) : of([] as List[])
    )
  );
  protected readonly lists = toSignal(this.lists$, { initialValue: [] as List[] });
  protected readonly selectedListId = signal<string | null>(null);
  protected readonly newListText = signal('');
  protected readonly isEditingList = signal(false);
  protected readonly editingListText = signal('');

  // Todo management signals
  protected readonly newTodoText = signal('');
  private readonly todos$ = toObservable(this.selectedListId).pipe(
    switchMap(listId => {
      if (!listId) {
        return of({ loading: false, data: [] as Todo[] });
      }
      return this.todoService.getTodos(listId);
    })
  );
  private readonly todosResult = toSignal(this.todos$, { initialValue: { loading: true, data: [] as Todo[] } });

  protected readonly todos = computed(() => {
    const result = this.todosResult();
    return result.loading ? [] : result.data;
  });

  constructor() {
    // Effect to select the first list when lists are loaded or change
    effect(() => {
      // Trigger this effect when the user or the lists change.
      this.user();
      const availableLists = this.lists();
      const currentSelection = this.selectedListId();

      if (availableLists.length === 0) {
        this.selectedListId.set(null);
      } else if (!currentSelection || !availableLists.find(l => l.id === currentSelection)) {
        this.selectedListId.set(availableLists[0].id);
      }
    });
  }

  async addTodo(): Promise<void> {
    const text = this.newTodoText().trim();
    const listId = this.selectedListId();
    if (text && listId) {
      const newTodo = await this.todoService.addTodo(listId, text);
      this.newTodoText.set('');
    }
  }

  async addList(): Promise<void> {
    const text = this.newListText().trim();
    const currentUser = this.user();
    if (text && currentUser) {
      const newList = await this.listService.addList(currentUser.uid, text);
      this.selectedListId.set(newList);
      this.newListText.set('');
    }
  }

  startEditList(): void {
    const listId = this.selectedListId();
    const list = this.lists().find(l => l.id === listId);
    if (list) {
      this.editingListText.set(list.name);
      this.isEditingList.set(true);
    }
  }

  cancelEditList(): void {
    this.isEditingList.set(false);
    this.editingListText.set('');
  }

  async saveEditList(): Promise<void> {
    const listId = this.selectedListId();
    const newName = this.editingListText().trim();
    if (listId && newName) {
      await this.listService.updateList(listId, newName);
      this.isEditingList.set(false);
    }
  }

  async deleteList(): Promise<void> {
    const listId = this.selectedListId();
    if (listId && confirm('Are you sure you want to delete this list and all its to-dos?')) {
      // Note: Deleting a list in Firestore doesn't automatically delete its subcollections.
      // For a production app, you'd need a Cloud Function to handle cascading deletes.
      await this.listService.deleteList(listId);
      this.selectedListId.set(this.lists()[0]?.id ?? null);
      this.isEditingList.set(false);
    }
  }

  async deleteTodo(todo: Todo): Promise<void> {
    const listId = this.selectedListId();
    if (listId) {
      await this.todoService.deleteTodo(listId, todo.id);
    }
  }

  async toggleTodo(todo: Todo): Promise<void> {
    const listId = this.selectedListId();
    if (listId) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await this.todoService.updateTodo(listId, updatedTodo);
    }
  }
}