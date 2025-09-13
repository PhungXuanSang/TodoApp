import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';
import { Request } from 'express';
import { UserInfo } from './common/interfaces/userInfo';
import { TodoMessages } from './constants/todos.messages';
import { TodoRoutes } from './constants/todo.routes';
import { GetUser } from './common/decorators/getUser';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/strategies/roles.Decorator';
import { RoleGuard } from 'src/auth/strategies/role.guard';
@ApiTags('auth')
@Controller(TodoRoutes.TODOS)
@UseGuards(JwtAuthGuard, RoleGuard)
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createTodo(@Body() dto: TodoDto, @GetUser() user: UserInfo['user']) {
    return await this.todoService.createTodo(dto, user.userId);
  }
  // @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get(TodoRoutes.GET_ALL)
  async getAllTodos() {
    return await this.todoService.findAll();
  }
  // @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTodosNotDelete() {
    return await this.todoService.findAllNotDelete();
  }
  // @UseGuards(JwtAuthGuard)
  // @Get('user/:userId')
  // async getallTodosByUserId(@Param('userId', ParseIntPipe) userId: number) {
  //   //  userId = req.user.userId;
  //   return this.todoService.findAllByUserId(userId);
  // }
  // @UseGuards(JwtAuthGuard)
  @Get(TodoRoutes.ID)
  async getTodoById(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.findOneById(id);
  }
  // @UseGuards(JwtAuthGuard)
  @Patch(TodoRoutes.ID)
  async updateTodo(
    @Param('id') id: number,
    @Body() dto: TodoDto,
    @GetUser() user: UserInfo['user'],
  ) {
    return await this.todoService.update(id, dto, user.userId);
  }
  // @UseGuards(JwtAuthGuard)
  @Delete(TodoRoutes.ID)
  async deleteTodo(@Param('id') id: number, @GetUser() user: UserInfo['user']) {
    await this.todoService.remove(id, user.userId);
    return { message: TodoMessages.TODO_DELETED_SUCC };
  }
}
