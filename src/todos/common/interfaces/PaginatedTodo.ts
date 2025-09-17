import { Todo } from 'src/todos/entity/todo.entity';

export interface PaginatedTodo {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
