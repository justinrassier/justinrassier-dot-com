import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoFacade } from '@justinrassier-dot-com/facade-testing/shared/todo/data-access';

@Component({
  selector: 'justinrassier-dot-com-todo-feature',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="todoFacade.todoState$ | async as todoState">
      <div class="p-4 ">
        <h1>Todos</h1>
        <div *ngIf="todoState.status === 'loading'">Loading...</div>
        <ul *ngIf="todoState.status === 'loaded'">
          <li *ngFor="let todo of todoState.todos">
            <div class="flex gap-2">
              <input
                type="checkbox"
                [checked]="todo.completed"
                (change)="onChange($event, todo.id)"
              />
              <span
                [ngClass]="{
                  'line-through': todo.completed,
                  'no-underline': !todo.completed
                }"
                >{{ todo.text }}</span
              >
            </div>
          </li>
        </ul>
      </div>
    </ng-container>
  `,
})
export class TodoFeatureComponent {
  todoFacade = inject(TodoFacade);

  constructor() {
    this.todoFacade.loadTodos();
  }

  onChange(event: Event, id: string) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.todoFacade.markTodoAsCompleted(id);
    } else {
      this.todoFacade.markTodoAsIncomplete(id);
    }
  }
}
