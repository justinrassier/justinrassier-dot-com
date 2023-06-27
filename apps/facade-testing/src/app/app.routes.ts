import { Route } from '@angular/router';
import {
  todoEffects,
  todoFeature,
} from '@justinrassier-dot-com/facade-testing/shared/todo/data-access';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@justinrassier-dot-com/facade-testing/todo/feature').then(
        (m) => m.TodoFeatureComponent
      ),
    providers: [provideState(todoFeature), provideEffects(todoEffects)],
  },
];
