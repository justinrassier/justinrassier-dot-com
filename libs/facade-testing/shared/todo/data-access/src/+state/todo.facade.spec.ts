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
    // Kick off the action in the same way your component would
    facade.loadTodos();

    // Ge the state out of the store without dealing with subscriptions and callbacks
    let todoState = await firstValueFrom(facade.todoState$);

    // This verifies that immediately after firing our action,
    // the reducer correctly updated the status to "loading"
    expect(todoState.status).toEqual('loading');

    // Now we can test that our action got all the way to making a real HTTP call to the expected endpoint
    // we can fulsh real HTTP status codes
    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: false }]);

    todoState = await firstValueFrom(facade.todoState$);

    // Verifies that after our effect finishes, the reducer picks up the
    // "success" action and updates the state. Provides the type narrowing below
    expect(todoState.status).toEqual('loaded');

    // Use Jest snapshots to better capture the expected structure of your state
    expect(todoState.todos).toMatchSnapshot();
  });

  it('should mark the todo as completed via the API', async () => {
    // load the todos like above
    facade.loadTodos();

    // flush the response from the API with a single todo that is not yet completed
    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: false }]);

    // use the facade to mark the todo as completed
    facade.markTodoAsCompleted('1');

    // Make sure that our store was eagerly updated, even before the API call finished
    const todoState = await firstValueFrom(facade.todoState$);
    expect(todoState.todos[0].completed).toEqual(true);

    // verify that the HTTP call was made to the correct endpoint
    httpController.expectOne('/api/todos/1').flush(201);
  });

  it('should uncheck the todo if the API call fails', async () => {
    facade.loadTodos();
    // flush the response from the API with a single todo that is not yet completed
    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: false }]);

    // use the facade to mark the todo as completed
    facade.markTodoAsCompleted('1');

    // Make sure that our store was eagerly updated, even before the API call finished
    let todoState = await firstValueFrom(facade.todoState$);

    expect(todoState.todos[0].completed).toEqual(true);

    //  flush an error instead of a success
    httpController
      .expectOne('/api/todos/1')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });

    // Make sure the todo was set back to unchecked
    todoState = await firstValueFrom(facade.todoState$);
    expect(todoState.todos[0].completed).toEqual(false);
  });

  it('should uncheck the todo if the API call fails after 3 attempts', async () => {
    facade.loadTodos();
    // flush the response from the API with a single todo that is not yet completed
    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: false }]);

    // use the facade to mark the todo as completed
    facade.markTodoAsCompleted('1');

    // Make sure that our store was eagerly updated, even before the API call finished
    let todoState = await firstValueFrom(facade.todoState$);

    expect(todoState.todos[0].completed).toEqual(true);

    //  flush an error instead of a success 3 times as we expect the HTTP call to be retried 3 times
    httpController
      .expectOne('/api/todos/1')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });
    httpController
      .expectOne('/api/todos/1')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });
    httpController
      .expectOne('/api/todos/1')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });
    httpController
      .expectOne('/api/todos/1')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });

    // Make sure the todo was set back to unchecked
    todoState = await firstValueFrom(facade.todoState$);

    expect(todoState.todos[0].completed).toEqual(false);
  });

  it('should mark the todo as incomplete via the API', async () => {
    facade.loadTodos();

    httpController
      .expectOne('/api/todos')
      .flush([{ id: '1', text: 'Todo 1', completed: true }]);

    facade.markTodoAsIncomplete('1');

    // Assert - the todo was eagerly updated
    const todoState = await firstValueFrom(facade.todoState$);
    expect(todoState.todos[0].completed).toEqual(false);

    // Assert -the todo was updated via the API
    httpController.expectOne('/api/todos/1').flush(201);
  });
});
