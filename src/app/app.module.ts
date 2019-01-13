import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { ModalModule } from 'ngx-modialog';

import { CoreModule } from './core/core.module';
import { AppStoreModule } from './store/app-store.module';
import { TodoListModule } from './todo-list/todo-list.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppStoreModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ModalModule.forRoot(),
    TodoListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
