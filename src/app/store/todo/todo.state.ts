import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Todo } from '../../core/model';

export interface TodoState extends EntityState<Todo> {
  editingTodoId: string;
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
  selectId: (todo: Todo) => todo.id,
});

export const initialTodoState: TodoState = adapter.getInitialState({
  editingTodoId: undefined,
});
