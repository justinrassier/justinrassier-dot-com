import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { TodoFacade } from './todo.facade';
import { todoEffects, todoFeature } from './todo.feature';
describe('TodoFacade', () => {
  let httpController: HttpTestingController;
  let facade: TodoFacade;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodoFacade,
        provideStore(),
        provideState(todoFeature),
        provideEffects(todoEffects),
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
    facade = TestBed.inject(TodoFacade);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should get get the todos from the API', async () => {
    let todoState = await firstValueFrom(facade.todos$);

    expect(todoState.type).toEqual('initial');

    facade.loadTodos();

    todoState = await firstValueFrom(facade.todos$);

    expect(todoState.type).toEqual('loading');

    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: false }]);

    todoState = await firstValueFrom(facade.todos$);

    expect(todoState.type).toEqual('loaded');
  });

  it('should mark the todo as completed via the API', async () => {
    facade.loadTodos();

    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: false }]);

    facade.markTodoAsCompleted('1');

    // Assert - the todo was eagerly updated
    const todoState = await firstValueFrom(facade.todos$);
    if (todoState.type !== 'loaded') {
      throw new Error('Todo state is not loaded');
    }
    expect(todoState.data[0].completed).toEqual(true);

    // Assert -the todo was updated via the API
    httpController.expectOne('/api/todos/1').flush(201);
  });

  it('should mark the todo as incomplete via the API', async () => {
    facade.loadTodos();

    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: true }]);

    facade.markTodoAsIncomplete('1');

    // Assert - the todo was eagerly updated
    const todoState = await firstValueFrom(facade.todos$);
    if (todoState.type !== 'loaded') {
      throw new Error('Todo state is not loaded');
    }
    expect(todoState.data[0].completed).toEqual(false);

    // Assert -the todo was updated via the API
    httpController.expectOne('/api/todos/1').flush(201);
  });
});
