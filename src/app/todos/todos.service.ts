import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { injectQuery, injectQueryClient } from "@tanstack/angular-query-experimental";


@Injectable({ providedIn: 'root' })
export class TodoService {

  queryClient = injectQueryClient();
  // query = injectQuery();
  constructor(
    private http: HttpClient
  ) {

  }

  getTodos() {
    return injectQuery(() => ({
      queryKey: ['todos'],
      queryFn: () => this.http.get<Todo>('http://localhost:3000/todos'),
    }));
  }

  addTodo(todo: Todo) {
      return this.http.post<Todo>('http://localhost:3000/todos', todo)
  }
}

export interface Todo {
  id: string;
  title: string;
}
