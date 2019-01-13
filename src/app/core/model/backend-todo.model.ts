import { Todo } from './todo.model';
import { ChangeType } from '../types';

export interface BackendTodo extends Todo {
  changeType: ChangeType;
}
