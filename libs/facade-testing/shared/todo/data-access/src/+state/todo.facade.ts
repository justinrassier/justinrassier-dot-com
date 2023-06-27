import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoUIActions, selectTodos } from './todo.feature';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  #store = inject(Store);
  todos$ = this.#store.select(selectTodos);
  loadTodos() {
    this.#store.dispatch(TodoUIActions.loadTodos());
  }

  markTodoAsCompleted(id: string) {
    this.#store.dispatch(TodoUIActions.markTodoComplete({ id }));
  }

  markTodoAsIncomplete(id: string) {
    this.#store.dispatch(TodoUIActions.markTodoIncomplete({ id }));
  }
}
