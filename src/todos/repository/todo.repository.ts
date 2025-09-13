import { DataSource, Repository } from 'typeorm';
import { Todo } from '../entity/todo.entity';
import { TodoDto } from '../dto/todo.dto';
import { User } from 'src/users/entity/users.entity';
import { NotFoundException } from '@nestjs/common';
import { TodoMessages } from '../constants/todos.messages';

export class TodoRepository extends Repository<Todo> {
  constructor(private datasource: DataSource) {
    super(Todo, datasource.createEntityManager());
  }
  async findAllNotDelete(): Promise<Todo[]> {
    return await this.find({
      where: {
        isDeleted: false,
      },
    });
  }
  async findAll(): Promise<Todo[]> {
    return await this.find();
  }
  async findOneById(id: number): Promise<Todo | null> {
    return await this.findOneBy({ id });
  }
  async createTodo(todoDto: TodoDto, user: User): Promise<Todo> {
    const todo = this.create({
      title: todoDto.title,
      description: todoDto.description || '',
      status: 'pending',
      isDeleted: false,
      user,
    });
    return await this.save(todo);
  }
  async updateTodo(todo: Todo, todoDto: TodoDto): Promise<Todo> {
    Object.assign(todo, todoDto);
    return await this.save(todo);
  }
  async deleteTodo(id: number): Promise<Todo> {
    const todo = await this.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(TodoMessages.TODO_NOT_FOUND);
    }
    todo.isDeleted = true;
    return this.save(todo);
  }
}
