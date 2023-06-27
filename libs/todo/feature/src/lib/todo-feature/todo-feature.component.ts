import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'justinrassier-dot-com-todo-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFeatureComponent { }
