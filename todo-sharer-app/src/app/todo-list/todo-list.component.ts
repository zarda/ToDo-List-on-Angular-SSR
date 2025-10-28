import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { TodoStore } from './todo.store';
import { ListManagerComponent } from '../list-manager/list-manager.component';
import { SharingManagerComponent } from '../sharing-manager/sharing-manager.component';
import { TodoControlsComponent } from '../todo-controls/todo-controls.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    ListManagerComponent,
    SharingManagerComponent,
    TodoControlsComponent,
    TodoItemComponent,
  ],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
  providers: [TodoStore],
})
export class TodoListComponent {
  protected readonly store = inject(TodoStore);
}