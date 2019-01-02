import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { TodoMetadata, ChangeType } from '../todo.model';
import { Action, ActionType } from './action.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: 'todo-item.component.html',
  styleUrls: ['todo-item.component.scss']
})

export class TodoItemComponent {
  @Input()
  set todo(todo: TodoMetadata) {
    this.handleInputData(todo);
  }
  get todo(): TodoMetadata { return this._todo; }
  @Output() action = new EventEmitter<Action>();
  public isEditing: boolean;
  private _todo: TodoMetadata;
  private tempTodo: TodoMetadata;

  constructor(private modal: Modal) {
    this.tempTodo = null;
    this.isEditing = false;
  }

  public toggleCompletion() {
    this.update();
  }

  public startEditing() {
    this.isEditing = true;
  }

  public stopEditing(newTitle: string) {
    newTitle = newTitle.trim();
    if (!newTitle) {
      return;
    }

    this.isEditing = false;
    if (this.tempTodo) {
      this.handleTempData(newTitle);
      return;
    }


    if (newTitle === this.todo.data.title) {
      return;
    }

    this.changeTitle(newTitle);
    this.update();
  }

  public cancelEditing() {
    this.isEditing = false;

    if (this.tempTodo) {
      if (this.tempTodo.type === ChangeType.removed) {
        this.handleRemovedChangeType(this.todo.data.title);
        return;
      }
      this._todo = this.tempTodo;
      this.tempTodo = null;
    }
  }

  private create() {
    this.emitAction(ActionType.add);
  }

  private update() {
    this.emitAction(ActionType.update);
  }

  public remove() {
    this.emitAction(ActionType.remove);
  }

  private emitAction(type: ActionType) {
    this.action.emit({ type, todo: this.todo });
  }

  private changeTitle(newTitle: string) {
    this._todo.data.title = newTitle;
  }

  private handleInputData(todo: TodoMetadata) {
    if (this.isEditing) {
      this.tempTodo = todo;
      return;
    }

    if (todo.type === ChangeType.removed) {
      this.remove();
    }

    this._todo = todo;
  }

  private handleTempData(newTitle: string) {
    const tempTodo = this.tempTodo;
    this.tempTodo = null;

    if (newTitle === tempTodo.data.title) {
      return;
    }

    this.changeTitle(newTitle);

    switch (tempTodo.type) {
      case ChangeType.modified:
        this.handleModifiedChangeType(tempTodo, newTitle);
        break;

      case ChangeType.removed:
        this.handleRemovedChangeType(newTitle);
        break;
    }
  }

  private handleModifiedChangeType(tempTodo: TodoMetadata, newTitle: string) {
    this.showDataModifiedModal(tempTodo.data.title, newTitle).then(decision => {
      switch (decision) {
        case 'local':
          this.update();
          break;
        case 'server':
          this._todo.data = tempTodo.data;
          break;
      }
    });
  }

  private handleRemovedChangeType(title: string) {
    this.showDataRemovedModal(title).then(decision => {
      switch(decision) {
        case 'create':
          this.create();
          this.remove();
          break;
        case 'remove':
          this.remove();
          break;
      }
    });
  }

  private showDataModifiedModal(serverData: string, localData: string) {
    const dialogRef = this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Data conflict')
      .body(`
        This ToDo was updated by another user!<br/>
        <br/>
        Server version:<br/>
        <b>${serverData}</b><br/>
        <br/>
        Local version:<br/>
        <b>${localData}</b><br/>
        <br/>
        Which version do you want to keep?
      `)
      .okBtn('Local')
      .okBtnClass('btn btn-default')
      .cancelBtn('Server')
      .open();

    return new Promise<string>(resolve => {
      dialogRef.result
        .then(()  => resolve('local') )
        .catch(() => resolve('server'));
    });
  }

  private showDataRemovedModal(localData: string) {
    const dialogRef = this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(false)
      .keyboard(27)
      .title('Data conflict')
      .body(`
      This ToDo was deleted by another user!<br/>
      <br/>
      You can create new <b>"${localData}"</b> ToDo or delete it.
    `)
    .okBtn('Create')
    .okBtnClass('btn btn-default')
    .cancelBtn('Delete')
    .open();

    return new Promise<string>(resolve => {
      dialogRef.result
        .then(()  => resolve('create') )
        .catch(() => resolve('remove'));
    });
  }
}
