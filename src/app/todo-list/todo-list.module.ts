import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

import { TodoListPageComponent } from './containers';
import { TodoItemComponent, TodoListComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BootstrapModalModule
  ],
  exports: [
    TodoListComponent
  ],
  declarations: [
    TodoListPageComponent,
    TodoListComponent,
    TodoItemComponent
  ],
  providers: [
  ],
})
export class TodoListModule { }
