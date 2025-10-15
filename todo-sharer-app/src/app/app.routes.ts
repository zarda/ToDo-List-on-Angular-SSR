import { Routes } from '@angular/router';
import { Login } from './login/login';
import { TodoList } from './todo-list/todo-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'todos', component: TodoList },
  { path: '', redirectTo: '/todos', pathMatch: 'full' }
];
