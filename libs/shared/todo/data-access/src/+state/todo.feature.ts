import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, tap } from 'rxjs';
import { TodoService } from '../todo.service';
import {
  AsyncState,
  initialAsyncState,
  loadedAsyncState,
  loadingAsyncState,
} from '@justinrassier-dot-com/shared/async-state/utility';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};
interface TodoState {
  todos: AsyncState<{ data: Todo[] }>;
}
const initialState: TodoState = {
  todos: initialAsyncState(),
};

export const TodoUIActions = createActionGroup({
  source: 'Todo UI',
  events: {
    'Load Todos': () => emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Mark Todo Complete': props<{ id: string }>(),
    'Mark Todo Incomplete': props<{ id: string }>(),
    'Mark Todo Complete Success': props<{ id: string }>(),
    'Mark Todo Incomplete Success': props<{ id: string }>(),
  },
});

export const todoFeature = createFeature({
  name: 'todo',
  reducer: createReducer(
    initialState,
    on(TodoUIActions.loadTodos, (state) => ({
      ...state,
      todos: loadingAsyncState(),
    })),
    on(
      TodoUIActions.loadTodosSuccess,
      (state, { todos }): TodoState => ({
        ...state,
        todos: loadedAsyncState({ data: todos }),
      })
    ),
    on(TodoUIActions.markTodoComplete, (state, { id }): TodoState => {
      if (state.todos.type !== 'loaded') {
        return state;
      }
      return {
        ...state,
        todos: loadedAsyncState({
          data: state.todos.data.map((todo) =>
            todo.id === id ? { ...todo, completed: true } : todo
          ),
        }),
      };
    }),
    on(TodoUIActions.markTodoIncomplete, (state, { id }): TodoState => {
      if (state.todos.type !== 'loaded') {
        return state;
      }
      return {
        ...state,
        todos: loadedAsyncState({
          data: state.todos.data.map((todo) =>
            todo.id === id ? { ...todo, completed: false } : todo
          ),
        }),
      };
    })
  ),
});

export const { selectTodos } = todoFeature;

const loadTodos$ = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodoUIActions.loadTodos),
      mergeMap(() =>
        todoService
          .loadTodos()
          .pipe(map((todos) => TodoUIActions.loadTodosSuccess({ todos })))
      )
    );
  },
  { functional: true }
);

const markTodoComplete$ = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodoUIActions.markTodoComplete),
      mergeMap(({ id }) =>
        todoService
          .markTodoAsCompleted(id)
          .pipe(map(() => TodoUIActions.markTodoCompleteSuccess({ id })))
      )
    );
  },
  { functional: true }
);

const markTodoIncomplete$ = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodoUIActions.markTodoIncomplete),
      mergeMap(({ id }) =>
        todoService
          .markTodoAsIncomplete(id)
          .pipe(map(() => TodoUIActions.markTodoIncompleteSuccess({ id })))
      )
    );
  },
  { functional: true }
);

export const todoEffects = {
  loadTodos$,
  markTodoComplete$,
  markTodoIncomplete$,
};
