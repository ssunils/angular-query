import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  provideAngularQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import 'zone.js';
import { TodosComponent } from './app/todos/todos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-todos></app-todos>
  `,
  imports: [TodosComponent],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideAngularQuery(new QueryClient())],
});
