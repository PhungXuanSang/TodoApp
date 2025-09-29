import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
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
    // const checkTodo = this.findAll

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

    this.applyFilters(qb, query);
    // if (status) {
    //   qb.andWhere('todo.status = :status', { status });
    // }

    // if (dueDate) {
    //   const startDay = new Date(dueDate);
    //   startDay.setHours(0, 0, 0, 0);
    //   const endDay = new Date(dueDate);
    //   endDay.setHours(24, 59, 59, 999);
    //   qb.andWhere('todo.dueDate BETWEEN :start AND :end', {
    //     start: startDay.toISOString(),
    //     end: endDay.toISOString(),
    //     // startDay,
    //     // endDay,
    //   });
    // }

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
  private applyFilters(qb: SelectQueryBuilder<Todo>, query: QueryTodoDto) {
    const { status, dueDate } = query;

    if (status) {
      qb.andWhere('todo.status = :status', { status });
    }

    if (dueDate) {
      const startDay = new Date(dueDate);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(dueDate);
      endDay.setHours(23, 59, 59, 999);

      qb.andWhere('todo.dueDate BETWEEN :start AND :end', {
        start: startDay.toISOString(),
        end: endDay.toISOString(),
      });
    }
  }
  async findAll(todoDto: QueryTodoDto): Promise<PaginatedTodo> {
    const { page, limit } = todoDto;
    const qb = this.createQueryBuilder('todo').leftJoinAndSelect(
      'todo.user',
      'user',
    );
    this.applyFilters(qb, todoDto);
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

  // async deleteTodo(id: number): Promise<Todo> {
  //   const todo = await this.findOne({ where: { id } });
  //   if (!todo) {
  //     throw new NotFoundException(TodoMessages.TODO_NOT_FOUND);
  //   }
  //   todo.isDeleted = true;
  //   return this.save(todo);
  // }
  async findById(id: number): Promise<Todo | null> {
    return await this.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });
  }
  async saveTodo(todo: Todo): Promise<Todo> {
    return await this.save(todo);
  }
}
