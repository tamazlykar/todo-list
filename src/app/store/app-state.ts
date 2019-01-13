import { RouterReducerState } from '@ngrx/router-store';
import { RouterState } from './custom-router-state-serializer';
import { TodoState } from './todo/todo.state';

export interface State {
  router: RouterReducerState<RouterState>;
  todo: TodoState;
}
