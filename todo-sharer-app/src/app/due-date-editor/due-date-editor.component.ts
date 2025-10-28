
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-due-date-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './due-date-editor.component.html',
  styleUrl: './due-date-editor.component.scss',
})
export class DueDateEditorComponent {
  selectedDate: Date | null;

  constructor(
    public dialogRef: MatDialogRef<DueDateEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dueDate: Date | null }
  ) {
    this.selectedDate = data.dueDate;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.selectedDate);
  }
}
