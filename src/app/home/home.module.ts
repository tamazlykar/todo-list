import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoListModule } from '../todo-list/todo-list.module';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    TodoListModule
  ],
  exports: [],
  declarations: [HomeComponent],
  providers: [],
})
export class HomeModule { }
