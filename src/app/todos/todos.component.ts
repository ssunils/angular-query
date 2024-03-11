import { HttpClient } from '@angular/common/http';
import { Component, Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [AngularQueryDevtools, ReactiveFormsModule, CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  todoService = inject(TodoService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  query = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => this.todoService.getTodos(),
  }));
  form = this.fb.group({
    title: ["", {
      validators: [Validators.required]
    }]
 });

  mutation = injectMutation(() => ({
    mutationFn: (todo: Todo) => this.todoService.addTodo(todo),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  }));

  onAddTodo() {
    if(!this.form.valid) {
      return;
    }
    this.mutation.mutate({
      id: Date.now().toString(),
      title: this.form.get('title')?.value as string,
    });
    this.form.reset();
  }
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);

  getTodos(): Promise<Todo[]> {
    return lastValueFrom(
      this.http.get<Todo[]>('http://localhost:3000/todos')
    );
  }

  addTodo(todo: Todo): Promise<Todo> {
    return lastValueFrom(
      this.http.post<Todo>('http://localhost:3000/todos', todo)
    );
  }
}

interface Todo {
  id: string;
  title: string;
}
