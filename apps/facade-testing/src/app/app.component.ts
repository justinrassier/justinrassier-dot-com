import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'justinrassier-dot-com-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  title = 'facade-testing';
}
