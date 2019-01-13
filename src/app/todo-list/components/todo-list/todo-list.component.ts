import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../core/model';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent {
  @Input() todos: Todo[];
  @Input() completedTodosCount: number;

  @Output() create = new EventEmitter<string>();
  @Output() update = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() editingTodo = new EventEmitter<string>();

  // Used by *ngFor to associate object or keys with particular DOM nodes
  // Without trackBy todo-item.component will be recreated every time when we change data in the list
  public trackById(index, todo: Todo) {
    return todo.id;
  }

  public onCreate(title: string) {
    this.create.emit(title);
  }

  public onUpdate(todo: Todo) {
    this.update.emit(todo);
  }

  public onDelete(id: string) {
    this.delete.emit(id);
  }

  public onEditing(id: string, isEditing: boolean) {
    if (!isEditing) {
      this.editingTodo.emit(undefined);
    } else {
      this.editingTodo.emit(id);
    }
  }
}
