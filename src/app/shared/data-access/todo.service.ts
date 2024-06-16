import { Injectable, signal } from '@angular/core';
import { CreateTodo, Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  #todos = signal<Todo[]>([]);
  todos = this.#todos.asReadonly();

  addTodo(todo: CreateTodo) {
    this.#todos.update((todos) => [
      ...todos,
      { ...todo, id: Date.now().toString() },
    ]);
  }

  deleteTodo(id: string) {
    this.#todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  updateTodo(updatedTodo: Todo) {
    this.#todos.update((todos) =>
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  }
}
