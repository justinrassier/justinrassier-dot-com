---
title: Use Discriminated Unions to Represent Your State
description: 'Discriminated unions to represent NgRx state'
published: false
slug: 2024-01-31-use-discriminated-unions-to-represent-your-state
publishedDate: '2024-01-31'
---

How you represent your state inside of your store is an important consideration.
One of the principles that I like to follow is to
[make impossible states impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8).
This is a concept that is inspired by the FP, and in particular
[Elm](https://elm-lang.org) community.

Assuming some todo items loaded from the server somewhere, you could set up your
state to look something like this

```typescript
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: boolean;
}
```

Pretty straight forward right? But what would it mean for your app if your state
somehow got into this state:

```typescript
{
  todos: [];
  loaded: true;
  error: true;
}
```

If you bind to those values in your template, it could show the user both an
error alert as well as incomplete data, or some other weird UI glitch that would
happen because this makes no sense.

You may say "that's what testing if for!" Sure... but what if we could eliminate
this from ever happening? You don't need to write a test for something that
cannot possibly exist in the first place right?

## Use discriminated unions

[Discriminated unions](https://en.wikipedia.org/wiki/Tagged_union) (also known
as tagged unions or sum types) are one of the core data structures leveraged
inside of functional languages. I personally would argue it is one of the most
powerful features that comes from FP.

The good news is TypeScript has the ability to leverage discriminated unions!

The bad news is that it is unfortunately a bit more clumsy than the first-class
support FP languages give to this construct. But even with it being a bit more
clunky, it is still well worth the guarantees that it gives you.

## Quick overview

A discriminated union is a type in which can represent one of many different
states. The catch is that you can be in only one of these states at a time.
Sounds a bit simplistic and obvious, but let's looks at an example of how I like
to represent async data that gets loaded from a server. Here is the definition
of the type:

```typescript
export type AsyncStateInitial = {
  type: 'initial';
};

export type AsyncStateLoading = {
  type: 'loading';
};

export type AsyncStateError = {
  type: 'error';
  errorMessage: string;
};

export type AsyncStateLoaded = {
  type: 'loaded';
  data: Todo[];
};
`

export type AsyncState =
  | AsyncStateInitial
  | AsyncStateLoading
  | AsyncStateError
  | AsyncStateLoaded;

```

Every variant of this union has a common "discriminator" (the field 'type' in
this case). This creates a very powerful way to represents business logic. A
variable of this type can be in only one of these states at a time. Depending on
the state that it is in, can carry variant-specific payloads. So in the case of
`loaded` it is the only variant that actually carries the result of loading the
todos from the server.

This wouldn't be super interesting if it didn't give us some guarantees. In
TypeScript, it will narrow the type down inside of `if/else` or other control
flow syntax.

```typescript
const myState: AsyncState = select(selectTodoState);

if (myState.type === 'loading') {
  console.log(myState.data); // ERROR! TypeScript won't compile
}
if (myState.type === 'loaded') {
  console.log(myState.data); // Prints todos
}
```

As you can probably see, this type narrowing also comes in play inside of your
Angular templates. Therefore you can easily use control flow inside of your
template to show/hide data given a certain variant.

```html
<div *ngIf="myState.type === 'loading'">Loading ...</div>
<div *ngIf="myState.type === 'loaded'">
  <ul>
    <li *ngFor="let todo of myState.data">{{ todo.text }}</li>
  </ul>
</div>
```

## Using discriminated unions in your store

Because discriminated unions do such a good job of explicitly representing your
domain, they make a solid fit for your NgRx store.

```typescript
const initialState: TodoState = {
  type: 'initial',
} as TodoState;

export const todoFeature = createFeature({
  name: 'todo',
  reducer: createReducer(
    initialState,
    on(TodoUIActions.loadTodos, (state): TodoState => {
      return {
        ...state,
        type: 'loading',
      };
    }),
    on(
      TodoUIActions.loadTodosSuccess,
      (_, { todos }): TodoState => ({
        type: 'loaded',
        data: todos,
      })
    )
  ),
});
```

Now when you select this type out of your store, you have something that can
accurately represent the state of the async operation of loading your data from
the server. Better yet, you can never get in a state where you are both
`loading` and in an `error` state. No test to write, because it's not even
possible to represent with this structure.

## Using discriminated unions as a computed/derived state

As mentioned with the lack of first-class support of discriminated unions in
TypeScript, sometimes dealing with the extra wrapping/unwrapping of the
discriminated union directly in your store can be annoying, or overly verbose
that it isn't quite worth dealing with. I personally will go above and beyond to
keep the backing data structure in my store as a discriminated union, but there
are times where I will give in. A secondary approach is to derive/compute the
discriminated union as your "view model" while keeping the backing structure of
your store a bit more flat and simple.

Taking the similar to what we started with:

```typescript
export interface TodoState {
  todos: Todo[];
  status: 'initial' | 'loading' | 'loaded' | 'error';
  errorMessage: string;
}
```

Then within our selectors we assemble the view model as a discriminated union.

```typescript
const selectComputedState = createSelector(
  selectTodoState,
  (state): ComputedState => {
    if (state.status === 'initial') {
      return { type: 'initial' };
    } else if (state.status === 'loading') {
      return { type: 'loading' };
    } else if (state.status === 'loaded') {
      return { type: 'loaded', todos: state.todos };
    }
    return { type: 'error', message: state.errorMessage };
  }
);
```

Granted it is now possible for our store to be in a state we wish to make
impossible, but with complicated state representations, or using something like
NgRx entity, wrapping that up inside of a discriminated union can be a bit of a
pain. This approach will still allow your view layer to cleanly represent your
problem and the states it can be in, without the extra complexity of managing
that in the store.

## Summary

Using a discriminated union as the backing structure inside of your NgRx store
can be a powerful tool to eliminate entire classes of bugs because they are no
longer even possible to represent inside of your code base. Even without it as a
backing structure, using it as part of your view model can still give you a
clean way to represent your state for your view.
