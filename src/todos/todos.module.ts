import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entity/todo.entity';
import { DataSource } from 'typeorm';
import { UserRepository } from 'src/users/repository/user.repository';
import { TodoRepository } from './repository/todo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [
    TodosService,
    {
      provide: TodoRepository,
      useFactory: (dataSource: DataSource) => new TodoRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [TodosService, UserRepository, TodoRepository],
})
export class TodosModule {}
