import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
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
}