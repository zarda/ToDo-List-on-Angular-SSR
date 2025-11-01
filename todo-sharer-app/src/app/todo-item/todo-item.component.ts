import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import type { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    A11yModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Input() isEditing = false;
  @Input() editingText = '';

  @Output() completionToggled = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<void>();
  @Output() editStarted = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();
  @Output() editSaved = new EventEmitter<void>();
  @Output() editTextChanged = new EventEmitter<string>();
  @Output() dueDateChanged = new EventEmitter<{ todoId: string; dueDate: Date | null }>();

  private pendingDate: Date | null = null;

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.pendingDate = event.value;
  }

  onDatePickerClosed(): void {
    if (this.pendingDate !== null) {
      this.dueDateChanged.emit({ todoId: this.todo.id, dueDate: this.pendingDate });
      this.pendingDate = null;
    }
  }

  getDueDateClass(): string {
    if (!this.todo.dueDate || this.todo.completed) {
      return '';
    }

    const now = new Date();
    const dueDate = this.todo.dueDate.toDate();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'overdue';
    } else if (diffDays <= 2) {
      return 'due-soon';
    }
    return '';
  }

  getDueDateIcon(): string {
    const dueDateClass = this.getDueDateClass();
    if (dueDateClass === 'overdue') {
      return 'error';
    } else if (dueDateClass === 'due-soon') {
      return 'warning';
    }
    return 'schedule';
  }

  getDueDateText(): string {
    if (this.todo.dueDate) {
      const date = this.todo.dueDate.toDate();
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return 'Unknown';
  }

  getDueDateAriaLabel(): string {
    if (this.todo.dueDate) {
      const date = this.todo.dueDate.toDate();
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `Edit due date: ${dateStr}`;
    }
    return 'Add due date';
  }

  isOverdue(): boolean {
    return this.getDueDateClass() === 'overdue';
  }

  isDueSoon(): boolean {
    return this.getDueDateClass() === 'due-soon';
  }
}