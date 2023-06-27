import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from './+state/todo.feature';

@Injectable({ providedIn: 'root' })
export class TodoService {
  #httpClient = inject(HttpClient);
  loadTodos() {
    return this.#httpClient.get<Todo[]>('/api/todos');
  }

  markTodoAsCompleted(id: string) {
    return this.#httpClient.patch(`/api/todos/${id}`, { completed: true });
  }
  markTodoAsIncomplete(id: string) {
    return this.#httpClient.patch(`/api/todos/${id}`, { completed: false });
  }
}
