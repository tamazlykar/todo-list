import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoListPageComponent } from './todo-list/containers/todo-list-page/todo-list-page.component';

const routes: Routes = [
  { path: ':listId', component: TodoListPageComponent },
  { path: '', component: TodoListPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
