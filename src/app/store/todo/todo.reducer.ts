import { adapter, initialTodoState, TodoState } from './todo.state';
import { TodoActionTypes, TodoActionUnion } from './todo.actions';
import { ChangeType } from '../../core/types';
import { Todo } from '../../core/model';

export function todoReducer(state = initialTodoState, action: TodoActionUnion): TodoState {
  switch (action.type) {
    case TodoActionTypes.ListStreamUpdatesReceived: {
      const todosToRemove = action.payload.todos.filter(todo => todo.changeType === ChangeType.removed).map(todo => todo.id);
      const todosToUpsert = action.payload.todos.filter(todo => todo.changeType !== ChangeType.removed).map(todo => {
        const newTodo: Todo = {
          id: todo.id,
          title: todo.title,
          isCompleted: todo.isCompleted,
        };
        return newTodo;
      });

      const stateAfterRemove = adapter.removeMany(todosToRemove, state);
      return adapter.upsertMany(todosToUpsert, stateAfterRemove);
    }
    case TodoActionTypes.SetEditingTodo: {
      return {
        ...state,
        editingTodoId: action.payload.id,
      };
    }
    default: {
      return state;
    }
  }
}
