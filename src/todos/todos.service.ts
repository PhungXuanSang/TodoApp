import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { TodoDto } from './dto/todo.dto';
import { TodoRepository } from './repository/todo.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { TodoMessages } from './constants/todos.messages';
import { PaginatedTodo } from './common/interfaces/PaginatedTodo';
import { QueryTodoDto } from './dto/QueryTodoDto';

@Injectable()
export class TodosService {
  constructor(
    private readonly todoRepo: TodoRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async createTodo(todoDto: TodoDto, userId: number): Promise<Todo> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(TodoMessages.USER_NOT_FOUND);
    }
    return this.todoRepo.createTodo(todoDto, user);
  }
  // admin + user
  async findAllNotDelete(todoDto: QueryTodoDto): Promise<PaginatedTodo> {
    return await this.todoRepo.findAllNotDeleted(todoDto);
  }
  // admin
  async findAll(todoDto: QueryTodoDto): Promise<PaginatedTodo> {
    return await this.todoRepo.findAll(todoDto);
  }

  async findAllByUserId(
    todoDto: QueryTodoDto,
    userId: number,
  ): Promise<PaginatedTodo> {
    return await this.todoRepo.findAllByUserId(todoDto, userId);
  }
  // async findAllByUserId(userId: number): Promise<Todo[]> {
  //   return this.todoRepository.find({
  //     where: {
  //       user: { id: userId },
  //       isDeleted: false,
  //     },
  //     // relations : ['user']
  //   });
  // }
  // admin+ user
  async findOneById(id: number): Promise<Todo | null> {
    return this.todoRepo.findOneBy({ id });
  }
  async update(id: number, todoDto: TodoDto): Promise<Todo> {
    const todo = await this.todoRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });
    if (!todo) {
      throw new NotFoundException(TodoMessages.TODO_NOT_FOUND);
    }
    if (!todo.user.auth.role) {
      throw new ForbiddenException(TodoMessages.NOT_AUTHORIZED_TO_UPDATE);
    }
    return await this.todoRepo.updateTodo(todo, todoDto);
  }
  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.todoRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });
    if (!todo) {
      throw new NotFoundException(TodoMessages.TODO_NOT_FOUND);
    }
    if (todo.isDeleted) {
      throw new NotFoundException(TodoMessages.TODO_ALREADY_DELETED);
    }
    if (todo.user.id !== userId) {
      throw new ForbiddenException(TodoMessages.NOT_AUTHORIZED_TO_UPDATE);
    }

    await this.todoRepo.deleteTodo(id);
  }
}
