import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

import 'prismjs';
import 'prismjs/components/prism-lua';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
