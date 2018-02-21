import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';

import { TodoListService } from './todo-list.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BootstrapModalModule
  ],
  exports: [
    TodoListComponent
  ],
  declarations: [
    TodoListComponent,
    TodoItemComponent
  ],
  providers: [
    TodoListService
  ],
})
export class TodoListModule { }
