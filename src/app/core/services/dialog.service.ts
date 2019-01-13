import { Injectable } from '@angular/core';
import { Modal } from 'ngx-modialog/plugins/bootstrap';

@Injectable()
export class DialogService {

  constructor(private modal: Modal) {}

  public showDataRemovedModal(localData: string) {
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
      .okBtn('CreateTodo')
      .okBtnClass('btn btn-default')
      .cancelBtn('DeleteTodo')
      .open();

    return new Promise<string>(resolve => {
      dialogRef.result
        .then(()  => resolve('create') )
        .catch(() => resolve('remove'));
    });
  }

  public showDataModifiedModal(serverData: string, localData: string) {
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
}
