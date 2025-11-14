import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { TodoStore } from '../todo-list/todo.store';

@Component({
  selector: 'app-todo-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    TranslateModule,
  ],
  templateUrl: './todo-controls.html',
  styleUrls: ['./todo-controls.scss'],
})
export class TodoControlsComponent {
  protected readonly store = inject(TodoStore);

  onSortChange(event: any): void {
    const value = event.value as 'order' | 'dueDate' | 'createdAt';
    if (value) {
      this.store.setSortBy(value);
    }
  }
}