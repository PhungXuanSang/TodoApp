import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { TodoDto } from './dto/todo.dto';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';

@Controller('todos')
// @UseGuards(JwtAuthGuard)
export class TodosController {
    constructor(private readonly todoService:TodosService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTodo(@Body() dto : TodoDto , @Req() req){

        const userId = req.user.userId;
         return this.todoService.createTodo(dto, userId);

    }
  //     @UseGuards(JwtAuthGuard)
    @Get()
    async getAllTodos(){
        return this.todoService.findAll();
    }
   @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    async getallTodosByUserId(@Param('userId') userId : number){
        //  userId = req.user.userId;
        return this.todoService.findAllByUserId(userId);
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTodoById(@Param('id') id : number){
        return this.todoService.findOne(id);
    }
        @UseGuards(JwtAuthGuard)
        @Patch(':id')
        async updateTodo(@Param('id') id : number, @Body() dto : TodoDto,@Req() req){
            return this.todoService.update(id, dto, req.user.userId);
        }
        @UseGuards(JwtAuthGuard)
        @Delete(':id')
        async deleteTodo(@Param('id') id : number, @Req() req){
            await this.todoService.remove(id, req.user.userId);
            return {message : 'Todo deleted successfully'};
        }


}
