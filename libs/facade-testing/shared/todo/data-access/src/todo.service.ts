import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Todo } from './+state/todo.feature';
import { retry } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  #httpClient = inject(HttpClient);
  loadTodos() {
    return this.#httpClient.get<Todo[]>('/api/todos');
  }

  markTodoAsCompleted(id: string) {
    // retry 3 times waiting 1 second between each retry
    return this.#httpClient
      .patch(`/api/todos/${id}`, { completed: true })
      .pipe(retry(3));
  }
  markTodoAsIncomplete(id: string) {
    return this.#httpClient.patch(`/api/todos/${id}`, { completed: false });
  }
}
