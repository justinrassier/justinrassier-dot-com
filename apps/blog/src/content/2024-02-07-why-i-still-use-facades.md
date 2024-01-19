---
title: Why I Still Use Facades
description: 'Why I think the facade pattern is still the way to go'
published: false
slug: 2024-02-07-why-i-still-use-facades
publishedDate: '2024-02-07'
---

There was a moment where the [facade pattern](https://en.wikipedia.org/wiki/Facade_pattern) in Angular was en vogue. But as the redux pattern for state management lost popularity (for reasons I still don't agree with) the facade pattern also seemed to lose its luster with the greater population.

I'm not going to talk about the technical definition of the facade pattern, but in regards to frontend frameworks and state management, I basically like to describe it as the "public API" to your state management solution. For many this feels like an extra set of code to duplication. To be honest, for many applications the API you create is indeed a simple proxy to the underlying store. So why do it?

## Flexibility

### Migrating state management solutions

The state management solution you chose today, may not be the one you want tomorrow. Listen, I love NgRx, and I still think it is one of the most scalable solutions for enterprise scale apps. But there are a lot of cool options out there, and ones that may fit your mental model better. But if you are in a legacy codebase, it is possible you can't just make a swap. But if you set up a facade in front of your store, it leaves you with a migration path that doesn't touch your component layer.

Take the following simple facade that uses stock NgRx:

```typescript
@Injectable({ providedIn: 'root' })
export class TodoFacade {
  #store = inject(Store);
  todoState$ = this.#store.select(selectTodoState);
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
```

One may look at this and think that this is just a bunch of boilerplate. Each of the store's actions are just simply exposed as class methods, and the selectors exposed as a public properties. Why waste the keystrokes?

For a small site, sure, this is unnecessary. But in enterprise, this thin layer can give you a migration path to a different state management solution:

Take the new [NgRx Signal Store](https://ngrx.io/guide/signals). This super awesome new state management solution which embraces Angular's move to signals may fit your application (or your mental model) better. Perhaps your whole team has agreed that this would be the ideal way to move forward. Great! But if you have a bunch of code already using traditional NgRx, then this may put you in a pickle. Without a facade, any attempt to migrate over to a new approach would require touching every single component that injects the store/actions/selectors.

With a facade, you can literally just swap out the underlying implementation and the consuming component can remain untouched.

```typescript
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
    //... markTodoAsComplete()
    //... markTodoAsIncomplete()
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
```

If you combine this with a [more comprehensive testing strategy](https://www.justinrassier.com/blog/posts/2024-01-17-stop-unit-testing-your-ngrx-store) you can wholesale swap out a state management solution for a new one without touching the tests as well. Given a passing build, you can merge with confidence.

### Mixing and Matching

This is similar to the above migration approach, which necessitates you live with multiple state management solutions at the same time. But perhaps a one-size-fits-all solution is not what you feel is best for you application. Perhaps sprinkling in a bit of NgRx Signal Store for a small feature is a desirable one-off approach, while the rest of the app can benefit from all the other redux-style goodness (that's right, redux is indeed NOT dead). The same architecture as above gives you the same flexibility. The consuming components have no need to concern itself with the underlying state management solution.

### Summary

The facade patter has been an absolute killer architectural decision in my professional life. It unlocks the ability to uniformly test your application as well as the flexibility to migrate or mix and match different state solutions depending on your needs without ever touching a line of component code. Claiming adding a facade is "boilerplate" because you thought it was annoying for your personal website is not a reason to dismiss the beautiful flexibility that a thin public API to your state management solution can give you. If you work on a complex app, the little extra code can unlock years of freedom as your app matures.
