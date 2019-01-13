import { Action } from '@ngrx/store';
import { BackendTodo, Todo } from '../../core/model';

export enum TodoActionTypes {
  ConnectToListStream = '[Todo] Connect to list stream',
  ListStreamUpdatesReceived = '[Firebase API] List stream updates received',
  CreateList = '[Todo] Create list with todo',
  CreateTodo = '[Todo] Create todo',
  UpdateTodo = '[Todo] Update todo',
  DeleteTodo = '[Todo] Delete todo',
  SetEditingTodo = '[Todo] Set editing todo',
}

export class ConnectToListStream implements Action {
  readonly type = TodoActionTypes.ConnectToListStream;

  constructor(readonly payload: { listId: string }) {}
}

export class ListStreamUpdatesReceived implements Action {
  readonly type = TodoActionTypes.ListStreamUpdatesReceived;

  constructor(readonly payload: { todos: BackendTodo[] }) {}
}

export class CreateList implements Action {
  readonly type = TodoActionTypes.CreateList;
}

export class CreateTodo implements Action {
  readonly type = TodoActionTypes.CreateTodo;

  constructor(readonly payload: { title: string }) {}
}

export class UpdateTodo implements Action {
  readonly type = TodoActionTypes.UpdateTodo;

  constructor(readonly payload: { todo: Todo }) {}
}

export class DeleteTodo implements Action {
  readonly type = TodoActionTypes.DeleteTodo;

  constructor(readonly payload: { id: string }) {}
}

export class SetEditingTodo implements Action {
  readonly type = TodoActionTypes.SetEditingTodo;

  constructor(readonly payload: { id: string }) {}
}

export type TodoActionUnion =
  | ConnectToListStream
  | ListStreamUpdatesReceived
  | CreateList
  | CreateTodo
  | UpdateTodo
  | DeleteTodo
  | SetEditingTodo;
