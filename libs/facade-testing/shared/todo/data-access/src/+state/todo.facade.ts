import { Injectable, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TodoService } from '../todo.service';
import { TodoState } from './todo.feature';

export const TodoSignalStore = signalStore(
  withState<TodoState>({
    todos: [],
    status: 'initial',
  }),
  withMethods((store, todoService = inject(TodoService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { status: 'loading' });
        }),
        switchMap(() => todoService.loadTodos()),
        tap((todos) => {
          patchState(store, {
            status: 'loaded',
            todos,
          });
        })
      )
    ),
  })),
  withComputed((store) => ({
    todoState: computed(() => {
      return {
        todos: store.todos(),
        status: store.status(),
      };
    }),
  }))
);

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  #signalStore = inject(TodoSignalStore);
  todoState$ = toObservable(this.#signalStore.todoState);
  loadTodos() {
    this.#signalStore.load();
  }
}
