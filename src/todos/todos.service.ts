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
import { UpdateStatusDto } from './dto/todo.updatedStatusDto';
import { UserRole } from 'src/users/entity/user.role';

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
  // admin+ user
  async findOneById(id: number): Promise<Todo | null> {
    return this.todoRepo.findOneBy({ id });
  }
  async update(
    id: number,
    todoDto: TodoDto,
    userId: number,
    role: UserRole,
  ): Promise<Todo> {
    const todo = await this.getCheckTodoOrFail(id, userId, role);
    return await this.todoRepo.updateTodo(todo, todoDto);
  }
  async updateStatus(
    id: number,
    todoDto: UpdateStatusDto,
    userId: number,
    role: UserRole,
  ): Promise<Todo> {
    const todo = await this.getCheckTodoOrFail(id, userId, role);
    return await this.todoRepo.updateStatusTodo(todo, todoDto);
  }
  async remove(id: number, userId: number, role: UserRole): Promise<void> {
    const todo = await this.getCheckTodoOrFail(id, userId, role);
    if (todo.isDeleted) {
      throw new NotFoundException(TodoMessages.TODO_ALREADY_DELETED);
    }

    await this.todoRepo.deleteTodo(id);
  }
  private async getCheckTodoOrFail(id: number, userId: number, role: UserRole) {
    const todo = await this.todoRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['user', 'user.auth'],
    });

    if (!todo) {
      throw new NotFoundException(TodoMessages.TODO_NOT_FOUND);
    }
    console.log('role:adminnnnnnnnnnnnnnnnnnn78' + todo.user.auth.role);
    console.log('role:' + todo.user.id + 'userId' + userId);
    // if (todo.user.auth.role !== 'admin') {

    // }
    // if (todo.user.id !== userId) {
    //   throw new ForbiddenException(TodoMessages.NOT_AUTHORIZED);
    // }
    // if (todo.user.id !== userId && todo.user.auth.role !== 'admin') {
    //   throw new ForbiddenException(TodoMessages.NOT_AUTHORIZED);
    // }
    if (role !== UserRole.ADMIN) {
      if (todo.user.id !== userId) {
        throw new ForbiddenException(TodoMessages.NOT_AUTHORIZED);
      }
    }

    return todo;
  }
}
