---
title: Visualize Your Tests With Snapshot Serializers
description: 'Use snapshot serializers to visualize your test snapshots'
published: true
slug: 2024-01-24-visualize-you-tests-with-snapshot-serializers
publishedDate: '2024-01-24'
---

At this point, [Jest snapshot testing](https://jestjs.io/docs/snapshot-testing) is a well known tool for efficiently testing the result of some complex object in your tests. The problem with them is that they can get to be pretty clumsy to work with, especially if you want to utilize inline snapshots.

Here is a simple test that loads ups todos from an API and spits out the whole state in an inline snapshot:

```typescript
it('should get get the todos from the API', async () => {
  // Kick off the action in the same way your component would
  facade.loadTodos();

  // Ge the state out of the store without dealing with subscriptions and callbacks
  let todoState = await firstValueFrom(facade.todoState$);

  // This verifies that immediately after firing our action,
  // the reducer correctly updated the status to "loading"
  expect(todoState.status).toEqual('loading');

  // Now we can test that our action got all the way to making a real HTTP call to the expected endpoint
  // we can flush real HTTP status codes
  httpController
    .expectOne('/api/todos')
    .flush([{ id: '1', text: 'Todo 1', completed: false }]);

  todoState = await firstValueFrom(facade.todoState$);

  // Verifies that after our effect finishes, the reducer picks up the
  // "success" action and updates the state. Provides the type narrowing below
  expect(todoState.status).toEqual('loaded');

  // Use Jest snapshots to better capture the expected structure of your state
  expect(todoState.todos).toMatchSnapshot();

  expect(todoState).toMatchInlineSnapshot(`
      {
        "status": "loaded",
        "todos": [
          {
            "completed": false,
            "id": "1",
            "text": "Todo 1",
          },
        ],
      }
    `);
});
```

This isn't too bad. The end result is something that you can relatively easily verify that everything looks correct. But what if you had a test that loaded up 10 todo items, manipulate them, then check the state at each point.

```typescript
it('should mark the todo as completed via the API', async () => {
  // load the todos like above
  facade.loadTodos();

  // flush the response from the API with a single todo that is not yet completed
  httpController.expectOne('/api/todos').flush([
    { id: '1', text: 'Todo 1', completed: false },
    { id: '2', text: 'Todo 2', completed: false },
    { id: '3', text: 'Todo 3', completed: false },
    { id: '4', text: 'Todo 4', completed: false },
    { id: '5', text: 'Todo 5', completed: false },
    { id: '6', text: 'Todo 6', completed: false },
    { id: '7', text: 'Todo 7', completed: false },
    { id: '8', text: 'Todo 8', completed: false },
    { id: '9', text: 'Todo 9', completed: true },
    { id: '10', text: 'Todo 9', completed: false },
  ]);

  // use the facade to mark the todo as completed
  facade.markTodoAsCompleted('1');

  // Make sure that our store was eagerly updated, even before the API call finished
  const todoState = await firstValueFrom(facade.todoState$);
  expect(todoState.todos[0].completed).toEqual(true);

  // verify that the HTTP call was made to the correct endpoint
  httpController.expectOne('/api/todos/1').flush(201);

  const updatedTodoState = await firstValueFrom(facade.todoState$);

  expect(updatedTodoState).toMatchInlineSnapshot(`
      {
        "status": "loaded",
        "todos": [
          {
            "completed": true,
            "id": "1",
            "text": "Todo 1",
          },
          {
            "completed": false,
            "id": "2",
            "text": "Todo 2",
          },
          {
            "completed": false,
            "id": "3",
            "text": "Todo 3",
          },
          {
            "completed": false,
            "id": "4",
            "text": "Todo 4",
          },
          {
            "completed": false,
            "id": "5",
            "text": "Todo 5",
          },
          {
            "completed": false,
            "id": "6",
            "text": "Todo 6",
          },
          {
            "completed": false,
            "id": "7",
            "text": "Todo 7",
          },
          {
            "completed": false,
            "id": "8",
            "text": "Todo 8",
          },
          {
            "completed": true,
            "id": "9",
            "text": "Todo 9",
          },
          {
            "completed": false,
            "id": "10",
            "text": "Todo 9",
          },
        ],
      }
    `);
});
```

That's getting pretty ugly right? This is a simple model, so you could see how anything more complicated would just be unmanageable.

## Custom Snapshot Serializers

Wouldn't it be nice to take that JSON blob and just visualize it like it would be in your UI? Well we don't have the DOM here, but what if we could make a little ASCII representation of the state so that it removes all the noise and let's you just quickly visualize your state?

All you have to do to define your own way of serializing for snapshot testing is to throw something like this at the top of your spec file:

```typescript
expect.addSnapshotSerializer({
  // the test to let Jest know this is a TodoState to serialize
  test: (val) => !!val.todos,
  // Whatever logic you want to print out
  print: (val) => {
    const todoState = val as TodoState;
    if (todoState.status === 'loading') {
      return 'Loading...';
    }

    if (todoState.status === 'loaded') {
      return todoState.todos
        .map((todo) => {
          return `${todo.text} ${todo.completed ? '✅' : '❌'}`;
        })
        .join('\n');
    }

    return 'Unknown status';
  },
});
```

That's it. You define a `test` for Jest to know if it should use your special serialization logic, and if it matches, it uses it instead of the default serializer.

So now our output of our inline snapshot looks like this:

```typescript
expect(updatedTodoState).toMatchInlineSnapshot(`
      Todo 1 ✅
      Todo 2 ❌
      Todo 3 ❌
      Todo 4 ❌
      Todo 5 ❌
      Todo 6 ❌
      Todo 7 ❌
      Todo 8 ❌
      Todo 9 ✅
      Todo 9 ❌
    `);
```

This is much easier at a glance to see if what modifications you made to your state actually are reflected in the serialized output!

## Get Creative

This is a simple example, but don't think this means it only works for simple state representations. I have used this to represent complex nested tabbed layout in the UI

```typescript
row
| column (50%)
| | [Module1, Module2*]  (30%)
| | [Module3**]  (70%)
| [Module4*]  (50%)
```

This may be a little cryptic, but this is a serialized layout of our dashboard-like layout engine at my work. The result is a nested grid layout with tabs,resizable panels, active module tracking, and more. This JSON representation of this would be roughly 50-100. But in a glance, I can verify that a modification to the updated things as I would expect. Making our layout engine fully testable without a UI.

So get creative with how you can represent your state and start visualizing your application right inside of your tests!
