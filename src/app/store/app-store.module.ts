import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterStateSerializer, StoreRouterConnectingModule, } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CustomRouterStateSerializer } from './custom-router-state-serializer';
import { environment } from '../../environments/environment';
import { todoReducer } from './todo/todo.reducer';
import { TodoEffects } from './todo/todo.effects';

const reducers = {
  router: routerReducer,
  todo: todoReducer,
};

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TodoEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    environment.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 30 }),
  ],
  exports: [],
  providers: [{ provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }],
})
export class AppStoreModule {
}
