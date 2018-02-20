import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoListService } from './todo-list.service';
import { Observable } from 'rxjs/observable';
import { Todo, TodoId } from './todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input('key') listId: string;
  @Output() onKey = new EventEmitter<string>();

  public list: TodoId[];
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

  public add(title: string) {
    title = title.trim();
    if (!title) {
      return;
    }

    if (!this.listId) {
      this.createList()
        .then(() => this.todoService.add(new Todo(title)));
      return;
    }

    this.todoService.add(new Todo(title));
  }

  public update(todo: TodoId) {
    this.todoService.update(todo);
  }

  public remove(todo: TodoId) {
    console.log(todo);
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
      .subscribe((data: TodoId[]) => {
        this.list = data;

        let count = 0;
        data.forEach(todo => {
          if (todo.isCompleted === true) count++;
        });
        this.completedTodosCount = count;
      });
  }
}
