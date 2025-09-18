import { DataSource, Repository } from 'typeorm';
import { Todo } from '../entity/todo.entity';
import { TodoDto } from '../dto/todo.dto';
import { User } from 'src/users/entity/users.entity';
import { NotFoundException } from '@nestjs/common';
import { TodoMessages } from '../constants/todos.messages';
import { PaginatedTodo } from '../common/interfaces/PaginatedTodo';
import { QueryTodoDto } from '../dto/QueryTodoDto';
import { UpdateStatusDto } from '../dto/todo.updatedStatusDto';

export class TodoRepository extends Repository<Todo> {
  constructor(private datasource: DataSource) {
    super(Todo, datasource.createEntityManager());
  }
  async findAllNotDeleted(query: QueryTodoDto): Promise<PaginatedTodo> {
    const { status, dueDate, page = 1, limit = 10 } = query;

    const qb = this.createQueryBuilder('todo')
      .where('todo.isDeleted = false')
      .leftJoinAndSelect('todo.user', 'user');

    if (status) {
      qb.andWhere('todo.status = :status', { status });
    }

    if (dueDate) {
      const startDay = new Date(dueDate);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(dueDate);
      endDay.setHours(24, 59, 59, 999);

      console.log('dueDate param:', dueDate);
      console.log('startOfDay:', startDay.toISOString());
      console.log('endOfDay:', endDay.toISOString());
      qb.andWhere('todo.dueDate BETWEEN :start AND :end', {
        start: startDay.toISOString(),
        end: endDay.toISOString(),
        // startDay,
        // endDay,
      });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findAllByUserId(
    query: QueryTodoDto,
    userId: number,
  ): Promise<PaginatedTodo> {
    const { status, dueDate, page = 1, limit = 10 } = query;

    const qb = this.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user')
      .where('todo.isDeleted = false')
      .andWhere('todo.userId = :userId', { userId });

    if (status) {
      qb.andWhere('todo.status = :status', { status });
    }

    if (dueDate) {
      const startDay = new Date(dueDate);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(dueDate);
      endDay.setHours(24, 59, 59, 999);

      console.log('dueDate param:', dueDate);
      console.log('startOfDay:', startDay.toISOString());
      console.log('endOfDay:', endDay.toISOString());
      qb.andWhere('todo.dueDate BETWEEN :start AND :end', {
        start: startDay.toISOString(),
        end: endDay.toISOString(),
        // startDay,
        // endDay,
      });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findAll(todoDto: QueryTodoDto): Promise<PaginatedTodo> {
    const { status, dueDate, page, limit } = todoDto;
    const qb = this.createQueryBuilder('todo').leftJoinAndSelect(
      'todo.user',
      'user',
    );
    if (status) {
      qb.andWhere('todo.status = :status', { status });
    }

    if (dueDate) {
      const startDay = new Date(dueDate);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(dueDate);
      endDay.setHours(24, 59, 59, 999);

      console.log('dueDate param:', dueDate);
      console.log('startOfDay:', startDay.toISOString());
      console.log('endOfDay:', endDay.toISOString());
      qb.andWhere('todo.dueDate BETWEEN :start AND :end', {
        start: startDay.toISOString(),
        end: endDay.toISOString(),
        // startDay,
        // endDay,
      });
    }
    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    // return await this.find();
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
  async updateStatusTodo(
    todo: Todo,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Todo> {
    Object.assign(todo, updateStatusDto);
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
  // async getCheckTodoOrFail(id: number, userId: number) {
  //   const todo = await this.findOne({
  //     where: { id, isDeleted: false },
  //     relations: ['user', 'user.auth'],
  //   });

  //   if (!todo) {
  //     throw new NotFoundException(TodoMessages.TODO_NOT_FOUND);
  //   }

  //   if (todo.user.id !== userId && todo.user.auth.role !== 'admin') {
  //     throw new ForbiddenException(TodoMessages.NOT_AUTHORIZED);
  //   }

  //   return todo;
  // }
}
