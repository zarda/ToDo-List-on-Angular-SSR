import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { TodoStore } from './todo-list/todo.store';

export const routes: Routes = [
  {
    path: '',
    // Lazy load the TodoListComponent
    loadComponent: () =>
      import('./todo-list/todo-list.component').then(
        (m) => m.TodoListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    // Lazy load the LoginComponent
    loadComponent: () =>
      import('./login/login').then((m) => m.Login),
  },
];