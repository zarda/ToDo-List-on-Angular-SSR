import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DueDateEditorComponent } from './due-date-editor.component';

describe('DueDateEditorComponent', () => {
  let component: DueDateEditorComponent;
  let fixture: ComponentFixture<DueDateEditorComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DueDateEditorComponent>>;

  const mockData = { dueDate: new Date('2025-10-30') };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DueDateEditorComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DueDateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedDate with data.dueDate', () => {
    expect(component.selectedDate).toEqual(mockData.dueDate);
  });

  it('should initialize selectedDate as null when data.dueDate is null', () => {
    const nullData = { dueDate: null };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DueDateEditorComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: nullData },
      ],
    });
    const nullFixture = TestBed.createComponent(DueDateEditorComponent);
    const nullComponent = nullFixture.componentInstance;

    expect(nullComponent.selectedDate).toBeNull();
  });

  it('should close dialog without data when onNoClick is called', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should close dialog with selectedDate when onSaveClick is called', () => {
    const newDate = new Date('2025-12-25');
    component.selectedDate = newDate;

    component.onSaveClick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(newDate);
  });

  it('should close dialog with null when onSaveClick is called and selectedDate is null', () => {
    component.selectedDate = null;

    component.onSaveClick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should allow updating selectedDate', () => {
    const newDate = new Date('2026-01-01');
    component.selectedDate = newDate;

    expect(component.selectedDate).toEqual(newDate);
  });

  it('should have dialogRef as public readonly', () => {
    expect(component.dialogRef).toBe(mockDialogRef);
  });

  it('should have data as public readonly', () => {
    expect(component.data).toEqual(mockData);
  });
});
