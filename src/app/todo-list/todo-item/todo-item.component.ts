import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoId } from '../todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: 'todo-item.component.html',
  styleUrls: ['todo-item.component.scss']
})

export class TodoItemComponent {
  @Input() todo: TodoId;
  @Output() onUpdate = new EventEmitter<TodoId>();
  @Output() onRemove = new EventEmitter<TodoId>();
  public isEditing: boolean;

  constructor() {
    this.isEditing = false;
  }

  public remove() {
    this.onRemove.emit(this.todo);
  }

  public toggleCompletion() {
    this.update();
  }

  public startEditing() {
    this.isEditing = true;
  }

  public stopEditing(newTitle: string) {
    this.isEditing = false;

    newTitle = newTitle.trim();
    if (!newTitle || newTitle === this.todo.title) {
      return;
    }

    this.todo.title = newTitle;
    this.update();
  }

  public cancelEditing() {
    this.isEditing = false;
  }

  private update() {
    this.onUpdate.emit(this.todo);
  }
}
