import { NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../shared/data-access/todo.service';
import { Todo } from '../shared/interfaces/todo';
import { UpdateTodoFormComponent } from './ui/update-todo-form.component';


@Component({
  standalone: true,
  selector: 'app-detail',
  template: `
    @if (todo(); as todo) {
    <button class="green" (click)="toggleForm()">Edit todo</button>
    <button class="primary m-left" (click)="goBack()">Back</button>
    <ng-container *ngIf="showDetailForm">
      <app-update-todo-form
        [todo]="todo"
        (todoUpdated)="submitForm($event)"
      ></app-update-todo-form>
    </ng-container>

    <h2>{{ todo.title }}</h2>
    <p>{{ todo.description }}</p>

    } @else {
    <p>Could not find todo...</p>
    }
  `,
  styles: [
    `
      .green {
        background-color: green;
      }

      .m-left {
        margin-left: 10px
      }
    `,
  ],
  imports: [NgIf, UpdateTodoFormComponent],
})
export default class DetailComponent {
  private route = inject(ActivatedRoute);
private router = inject(Router);
  todoService = inject(TodoService);

  private paramMap = toSignal(this.route.paramMap);
  public showDetailForm = false;

  todo = computed(() =>
    this.todoService
      .todos()
      .find((todo) => todo.id === this.paramMap()?.get('id'))
  );

  toggleForm(): void {
    this.showDetailForm = !this.showDetailForm;
  }

  goBack(): void {
    this.router.navigate(['home']);
  }

  submitForm(todo: Todo): void {
    this.todoService.updateTodo(todo);
    this.toggleForm();
  }
}
