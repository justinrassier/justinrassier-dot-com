import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { TodoUIActions, todoEffects } from './todo.feature';
import { TodoService } from '../todo.service';

describe('TodoEffects', () => {
  let actions$ = new Observable<Action>();
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)],
    })
  );

  it('should test something useful', () => {
    actions$ = hot('a|', { a: { type: TodoUIActions.loadTodos.type } });
    const todoService: Partial<TodoService> = {
      loadTodos: () =>
        cold('b|', { b: [{ id: '1', text: 'Todo 1', completed: false }] }),
    };

    const expected = hot('b|', {
      b: {
        type: TodoUIActions.loadTodosSuccess.type,
        todos: [{ id: '1', text: 'Todo 1', completed: false }],
      },
    });

    expect(
      todoEffects.loadTodos$(actions$, todoService as TodoService)
    ).toBeObservable(expected);
  });
});
