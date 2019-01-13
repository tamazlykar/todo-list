import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State, todoActions, todoSelectors } from '../../store';
import { BackendTodo, Todo } from '../model';
import { FirebaseTodoBackendService } from './firebase-todo-backend.service';
import { ChangeType } from '../types';
import { DialogService } from './dialog.service';

@Injectable()
export class TodoService {
  private editingTodoId: string;
  private serverVersionOfConflictedTodo: BackendTodo;

  constructor(
    private store: Store<State>,
    private todoBackendService: FirebaseTodoBackendService,
    private dialogService: DialogService,
  ) {
    store.pipe(select(todoSelectors.getEditingTodoId)).subscribe(id => {
      this.editingTodoId = id;
    });
  }

  public fetch(listId: string): Observable<BackendTodo[]> {
    return this.todoBackendService.fetch(listId).pipe(
      map((todos) => this.fetchedDataConflictHandler(todos))
    );
  }

  public createList(): Promise<string> {
    return this.todoBackendService.createList();
  }

  public create(title: string) {
    this.todoBackendService.create(title);
  }

  public update(todo: Todo) {
    const isConflictedDataFound = this.serverVersionOfConflictedTodo && this.serverVersionOfConflictedTodo.id === todo.id;
    if (isConflictedDataFound) {
      this.conflictResolver(this.serverVersionOfConflictedTodo, todo);
    } else {
      this.todoBackendService.update(todo);
    }
  }

  public delete(id: string) {
    this.todoBackendService.delete(id);
  }

  private fetchedDataConflictHandler(todos: BackendTodo[]): BackendTodo[] {
    if (!this.isIncludeEditingNow(todos)) {
      return todos;
    }
    this.serverVersionOfConflictedTodo = todos.find(todo => todo.id === this.editingTodoId);
    return todos.filter(todo => todo.id !== this.editingTodoId);
  }

  private isIncludeEditingNow(todos: BackendTodo[]): boolean {
    return todos.findIndex(todo => todo.id === this.editingTodoId) >= 0;
  }

  private conflictResolver(serverVersion: BackendTodo, localVersion: Todo) {
    const isServerVersionModified = serverVersion.changeType === ChangeType.modified;
    const isVersionsHaveSameTitle = serverVersion.title === localVersion.title;
    const isVersionsHaveSameCompletionStatus = serverVersion.isCompleted === localVersion.isCompleted;
    if (isServerVersionModified && isVersionsHaveSameTitle && !isVersionsHaveSameCompletionStatus) {
      return;
    }

    switch (serverVersion.changeType) {
      case ChangeType.modified: {
        this.modificationConflictResolver(serverVersion, localVersion);
        break;
      }
      case ChangeType.removed: {
        this.deletionConflictResolver(serverVersion, localVersion);
        break;
      }
      default: {}
    }
  }

  private modificationConflictResolver(serverVersion: BackendTodo, localVersion: Todo) {
    this.dialogService.showDataModifiedModal(serverVersion.title, localVersion.title)
      .then(result => {
        if (result === 'local') {
          this.todoBackendService.update(localVersion);
        } else {
          this.store.dispatch(new todoActions.ListStreamUpdatesReceived({ todos: [serverVersion]}));
        }
      });
  }

  private deletionConflictResolver(serverVersion: BackendTodo, localVersion: Todo) {
    this.dialogService.showDataRemovedModal(localVersion.title)
      .then(result => {
        if (result === 'create') {
          this.todoBackendService.create(localVersion.title);
        }
        // in both cases previous todo need to be deleted
        this.store.dispatch(new todoActions.ListStreamUpdatesReceived({ todos: [serverVersion]}));
      });
  }
}
