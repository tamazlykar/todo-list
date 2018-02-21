import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoListService } from './todo-list.service';
import { Observable } from 'rxjs/observable';
import { Todo, TodoMetadata, ChangeType } from './todo.model';
import { Action, ActionType } from './todo-item/action.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input('key') listId: string;
  @Output() onKey = new EventEmitter<string>();

  public list: TodoMetadata[];
  public completedTodosCount: number;

  constructor(private todoService: TodoListService) {
    this.list = [];
    this.completedTodosCount = 0;
  }

  ngOnInit() {
    if (this.listId) {
      this.fetchList(this.listId);
    }
  }

  // Used by *ngFor to associate object or keys with particular DOM nodes
  // Without trakBy todo-item.component will be recreated every time when we change data in the list
  public trackById(index, todo: TodoMetadata) {
    return todo.id;
  }

  public create(title: string) {
    title = title.trim();
    if (!title) {
      return;
    }

    if (!this.listId) {
      this.createList()
        .then(() => this.todoService.add(new Todo(title)));
      return;
    }

    this.add(new Todo(title));
  }

  public onItemAction(action: Action) {
    switch (action.type) {
      case ActionType.add:
        this.add(action.todo.data);
        break;
      case ActionType.remove:
        if (action.todo.type !== ChangeType.removed) {
          this.remove(action.todo);
        }
        this.removeListData(action.todo);
        break;
      case ActionType.update:
        this.update(action.todo);
        break;
    }
  }

  private add(todo: Todo) {
    this.todoService.add(todo);
  }

  private update(todo: TodoMetadata) {
    this.todoService.update(todo);
  }

  private remove(todo: TodoMetadata) {
    this.todoService.remove(todo);
  }

  private createList() {
    return this.todoService.createTodoList().then(id => {
      this.listId = id;
      this.fetchList(id);
      this.onKey.emit(id);
    })
  }

  private fetchList(id: string) {
    this.todoService.fetch(id)
      .subscribe((data: TodoMetadata[]) => {
        this.handleData(data);
        this.countCompletedTodos();
      });
  }

  private countCompletedTodos() {
    let count = 0;
    this.list.forEach(todo => {
      if (todo.data.isCompleted === true) count++;
    });
    this.completedTodosCount = count;
  }

  private handleData(todoList: TodoMetadata[]) {
    todoList.forEach(todo => {
      switch (todo.type) {
        case ChangeType.added:
          this.addListData(todo);
          break;
        case ChangeType.modified:
        case ChangeType.removed:
          this.updateListData(todo);
          break;
      }
    })
  }

  private addListData(todo: TodoMetadata) {
    this.list.push(todo);
  }

  private removeListData(todo: TodoMetadata) {
    const index = this.list.findIndex((value: TodoMetadata) => {
      return value.id === todo.id;
    });

    if (index === -1) return;

    this.list.splice(index, 1);
  }

  private updateListData(todo: TodoMetadata) {
    const index = this.list.findIndex((value: TodoMetadata) => {
      return value.id === todo.id;
    });

    if (index === -1) return;

    this.list[index] = todo;
  }
}
