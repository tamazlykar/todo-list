import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, TodoState } from './todo.state';

const getTodoState = createFeatureSelector<TodoState>('todo');

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(getTodoState);

export const getAll = createSelector(
  selectAll,
  todos => todos.reverse()
);

export const getCompletedTodoCount = createSelector(
  selectAll,
  state => state.reduce((count, todo) => {
    if (todo.isCompleted) {
      count += 1;
    }
    return count;
  }, 0),
);

export const getEditingTodoId = createSelector(
  getTodoState,
  state => state.editingTodoId,
);
