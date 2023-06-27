import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@justinrassier-dot-com/todo/feature').then(
        (m) => m.TodoFeatureComponent
      ),
  },
];
