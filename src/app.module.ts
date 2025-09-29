import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
      envFilePath: '.env',
    }),
    // DB_HOST=localhost
    // DB_PORT=5432
    // DB_TYPE=postgres
    // DB_PASS=root
    // DB_NAME=todos
    //    host: 'localhost',
    //       port: 5432,
    //       entities: [User, Auth, Todo],
    //       username: 'postgres',

    //       password: 'root',
    //       database: 'todos',

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'postgres'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Auth, Todo],
        synchronize: true,
        logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
