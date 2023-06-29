import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { catchError, map, mergeMap, of } from 'rxjs';
import { TodoService } from '../todo.service';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};
export interface TodoState {
  todos: Todo[];
  status: 'initial' | 'loading' | 'loaded' | 'error';
}
const initialState: TodoState = {
  todos: [],
  status: 'initial',
};

export const TodoUIActions = createActionGroup({
  source: 'Todo UI',
  events: {
    'Load Todos': () => emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Failure': () => emptyProps(),
    'Mark Todo Complete': props<{ id: string }>(),
    'Mark Todo Incomplete': props<{ id: string }>(),
    'Mark Todo Complete Success': props<{ id: string }>(),
    'Mark Todo Complete Failure': props<{ id: string }>(),
    'Mark Todo Incomplete Success': props<{ id: string }>(),
    'Mark Todo Incomplete Failure': props<{ id: string }>(),
  },
});

export const todoFeature = createFeature({
  name: 'todo',
  reducer: createReducer(
    initialState,
    on(
      TodoUIActions.loadTodos,
      (state): TodoState => ({
        ...state,
        status: 'loading',
      })
    ),
    on(
      TodoUIActions.loadTodosSuccess,
      (state, { todos }): TodoState => ({
        ...state,
        todos,
        status: 'loaded',
      })
    ),
    on(TodoUIActions.markTodoComplete, (state, { id }): TodoState => {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: true } : todo
        ),
      };
    }),
    on(TodoUIActions.markTodoCompleteFailure, (state, { id }): TodoState => {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: false } : todo
        ),
      };
    }),
    on(TodoUIActions.markTodoIncomplete, (state, { id }): TodoState => {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: false } : todo
        ),
      };
    })
  ),
});

export const { selectTodoState } = todoFeature;

const loadTodos$ = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodoUIActions.loadTodos),
      mergeMap(() =>
        todoService.loadTodos().pipe(
          map((todos) => TodoUIActions.loadTodosSuccess({ todos })),
          catchError(() => of(TodoUIActions.loadTodosFailure()))
        )
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
        todoService.markTodoAsCompleted(id).pipe(
          map(() => TodoUIActions.markTodoCompleteSuccess({ id })),
          catchError(() => of(TodoUIActions.markTodoCompleteFailure({ id })))
        )
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
