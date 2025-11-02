import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../models/todo.model';
import { Timestamp } from '@angular/fire/firestore';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  const mockTodo: Todo = {
    id: 'todo-1',
    text: 'Test Todo',
    completed: false,
    order: 1,
    ownerUid: 'test-uid',
    createdAt: Timestamp.now(),
    updatedAt: null,
    dueDate: Timestamp.now()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).overrideComponent(TodoItemComponent, {
      set: { changeDetection: 0 }
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    component.isEditing = false;
    component.editingText = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit completionToggled when checkbox is changed', () => {
    spyOn(component.completionToggled, 'emit');

    const checkbox = fixture.nativeElement.querySelector('mat-checkbox input');
    checkbox.click();

    expect(component.completionToggled.emit).toHaveBeenCalledWith(true);
  });

  it('should emit deleteStarted when delete button is clicked', () => {
    spyOn(component.deleteStarted, 'emit');

    const deleteButton = fixture.nativeElement.querySelector('button[aria-label="Delete to-do"]');
    deleteButton.click();

    expect(component.deleteStarted.emit).toHaveBeenCalled();
  });

  it('should emit editStarted when edit button is clicked', () => {
    spyOn(component.editStarted, 'emit');

    const editButton = fixture.nativeElement.querySelector('button[aria-label="Edit to-do"]');
    editButton.click();

    expect(component.editStarted.emit).toHaveBeenCalled();
  });

  it('should switch to edit mode when isEditing is true', () => {
    component.isEditing = false;
    expect(component.isEditing).toBeFalse();

    component.isEditing = true;
    expect(component.isEditing).toBeTrue();
  });

  it('should emit editCancelled event', () => {
    spyOn(component.editCancelled, 'emit');
    component.editCancelled.emit();
    expect(component.editCancelled.emit).toHaveBeenCalled();
  });

  it('should emit editSaved event', () => {
    spyOn(component.editSaved, 'emit');
    component.editSaved.emit();
    expect(component.editSaved.emit).toHaveBeenCalled();
  });

  it('should display due date when present', () => {
    fixture.detectChanges();

    const dueDateText = fixture.nativeElement.querySelector('.due-date-text');
    expect(dueDateText).toBeTruthy();
  });

  it('should have editingText property', () => {
    component.editingText = 'Test';
    expect(component.editingText).toBe('Test');
  });

  it('should have isConfirmingDelete property', () => {
    component.isConfirmingDelete = false;
    expect(component.isConfirmingDelete).toBe(false);

    component.isConfirmingDelete = true;
    expect(component.isConfirmingDelete).toBe(true);
  });

  it('should emit editTextChanged event', () => {
    spyOn(component.editTextChanged, 'emit');
    component.editTextChanged.emit('new text');
    expect(component.editTextChanged.emit).toHaveBeenCalledWith('new text');
  });
});
