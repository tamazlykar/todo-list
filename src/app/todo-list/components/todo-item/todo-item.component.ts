import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Todo } from '../../../core/model';

@Component({
  selector: 'app-todo-item',
  templateUrl: 'todo-item.component.html',
  styleUrls: ['todo-item.component.scss']
})

export class TodoItemComponent implements OnChanges {
  @Input() todo: Todo;
  @Output() editing = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<Todo>();
  @Output() deleted = new EventEmitter<string>();
  form: FormGroup;
  isEditTitleMode = false;

  constructor() {
    this.form = new FormGroup({
      title: new FormControl(undefined),
      isCompleted: new FormControl(undefined),
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.todo) {
      const updatedTodo: Todo = changes.todo.currentValue;
      this.form.setValue({
        title: updatedTodo.title,
        isCompleted: updatedTodo.isCompleted,
      });
    }
  }

  public sendDeleteAction() {
    this.deleted.emit(this.todo.id);
  }

  public startEditMode() {
    this.isEditTitleMode = true;
    this.editing.emit(true);
  }

  public updateCompleted() {
    this.finishEditMode();
    this.sendUpdateAction();
  }

  public updateCanceled() {
    if (!this.isEditTitleMode) {
      return;
    }
    this.finishEditMode();
    this.form.controls.title.setValue(this.todo.title);
    // need to send an update action for conflict resolving if any
    this.sendUpdateAction();
  }

  private sendUpdateAction() {
    const updatedTodo = {
      ...this.todo,
      ...this.form.value,
    };
    this.updated.emit(updatedTodo);
  }

  private finishEditMode() {
    this.isEditTitleMode = false;
    this.editing.emit(false);
  }
}
