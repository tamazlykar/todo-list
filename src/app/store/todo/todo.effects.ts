import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  ConnectToListStream,
  CreateList,
  CreateTodo,
  DeleteTodo,
  ListStreamUpdatesReceived,
  TodoActionTypes,
  UpdateTodo,
} from './todo.actions';
import { TodoService } from '../../core/services';
import { State } from '../app-state';

@Injectable()
export class TodoEffects {
  @Effect()
  load$: Observable<Action> = this.actions$.pipe(
    ofType<ConnectToListStream>(TodoActionTypes.ConnectToListStream),
    switchMap((action) => this.todoService.fetch(action.payload.listId).pipe(
      map((todos) => new ListStreamUpdatesReceived({ todos })),
      catchError(error => of(error)),
    )),
  );

  @Effect({ dispatch: false })
  createList$ = this.actions$.pipe(
    ofType<CreateList>(TodoActionTypes.CreateList),
    map(() => this.todoService.createList().
      then(listId => this.redirectToListUrl(listId)))
  );

  @Effect({ dispatch: false })
  createTodo$ = this.actions$.pipe(
    ofType<CreateTodo>(TodoActionTypes.CreateTodo),
    map((action) => this.todoService.create(action.payload.title))
  );

  @Effect({ dispatch: false })
  updateTodo$ = this.actions$.pipe(
    ofType<UpdateTodo>(TodoActionTypes.UpdateTodo),
    map(action => this.todoService.update(action.payload.todo))
  );

  @Effect({ dispatch: false })
  deleteTodo$ = this.actions$.pipe(
    ofType<DeleteTodo>(TodoActionTypes.DeleteTodo),
    map(action => this.todoService.delete(action.payload.id))
  );

  constructor(private actions$: Actions, private todoService: TodoService, private store: Store<State>, private router: Router) {}

  private redirectToListUrl(listId: string) {
    this.router.navigate(['/', listId]);
  }
}
