import { TodoMetadata } from '../todo.model';

export interface Action {
  type: ActionType;
  todo: TodoMetadata;
}

export type ActionType = 'add' | 'update' | 'remove';

export const ActionType = {
  add: 'add' as ActionType,
  update: 'update' as ActionType,
  remove: 'remove' as ActionType
}
