import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ConnectToListStream } from '../../../store/todo/todo.actions';
import { routerSelectors, State, todoActions, todoSelectors } from '../../../store';
import { Todo } from '../../../core/model';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';


@Component({
  selector: 'app-todo-list-page',
  templateUrl: './todo-list-page.component.html',
  styleUrls: ['./todo-list-page.component.scss']
})
export class TodoListPageComponent implements OnInit {
  todos$: Observable<Todo[]> = this.store.pipe(select(todoSelectors.getAll));
  completedTodoCount$ = this.store.pipe(select(todoSelectors.getCompletedTodoCount));
  listId$ = this.store.pipe(select(routerSelectors.getRouterListIdParam));
  url$ = this.listId$.pipe(map(() => document.location.href));

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.listId$.pipe(filter(id => id != null))
      .subscribe((id) => this.fetchList(id));
  }

  public onCreate(title: string) {
    this.listId$.pipe(take(1))
      .subscribe(listId => this.creationHandler(!!listId, title));
  }

  public onUpdate(todo: Todo) {
    this.store.dispatch(new todoActions.UpdateTodo({ todo }));
  }

  public onDelete(id: string) {
    this.store.dispatch(new todoActions.DeleteTodo({ id }));
  }

  public onEditingTodo(id: string) {
    this.store.dispatch(new todoActions.SetEditingTodo({ id }));
  }

  private fetchList(listId: string) {
    this.store.dispatch(new ConnectToListStream({ listId }));
  }

  private creationHandler(isListExist: boolean, todoTitle: string) {
    if (isListExist) {
      this.store.dispatch(new todoActions.CreateTodo({ title: todoTitle }));
    } else {
      this.store.dispatch(new todoActions.CreateList());
      this.listId$.pipe(
        filter(id => id != null),
        take(1)
      ).subscribe(() => this.store.dispatch(new todoActions.CreateTodo({ title: todoTitle })));
    }
  }
}
