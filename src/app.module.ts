import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/users.entity';
import { Auth } from './auth/entity/auth.entity';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/entity/todo.entity';

@Module({
   imports: [
    ConfigModule.forRoot({ 
        isGlobal: true,
        envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
    }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
    entities: [User, Auth,Todo], 
        username: "postgres",
        password: "root",
        database: "todos",
      
        synchronize: true, 
    }),
    AuthModule,
    UsersModule,
    TodosModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
