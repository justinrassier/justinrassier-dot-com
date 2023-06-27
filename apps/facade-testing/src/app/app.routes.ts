import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import {
  todoEffects,
  todoFeature,
} from '@justinrassier-dot-com/shared/todo/data-access';
import { provideEffects } from '@ngrx/effects';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@justinrassier-dot-com/todo/feature').then(
        (m) => m.TodoFeatureComponent
      ),
    providers: [provideState(todoFeature), provideEffects(todoEffects)],
  },
];
