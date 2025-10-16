import { Routes } from '@angular/router';
import { Login } from './login/login';
import { TodoList } from './todo-list/todo-list';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'todos', component: TodoList, canActivate: [authGuard] },
  { path: '', redirectTo: '/todos', pathMatch: 'full' }
];
