import { BadRequestException, Injectable } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoDto } from './dto/todo.dto';
import { use } from 'passport';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) { }

    async createTodo(todoDto: TodoDto, userId: number): Promise<Todo> {
        const user = await this.todoRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        const todo = this.todoRepository.create({ ...todoDto, user, isDeleted: false });
        console.log(`requested userId: ${userId}`);
        return this.todoRepository.save(todo);
    }
    async findAll(): Promise<Todo[]> {

        return this.todoRepository.find({
            where: {
                isDeleted: false,
                
            },

        });
    }
    async findAllByUserId(
        userId: number


    ): Promise<Todo[]> {
        return this.todoRepository.find({
            where: {
                user: { id: userId },
                isDeleted: false
            },
            // relations : ['user']
        });
    }
    async findOne(id: number): Promise<Todo | null> {
        return this.todoRepository.findOneBy({ id });
    }
    async update(id: number, todoDto: TodoDto, userId: number): Promise<Todo | null> {
        const todo = await this.todoRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['user']
        });
        if (!todo) {
            throw new BadRequestException('Todo not found');
        }
        if (todo.user.id !== userId) {
            throw new Error('You are not authorized to update this todo');
        }

        // Object.assign(todo, todoDto);
        // return this.todoRepository.save(todo);

        await this.todoRepository.update(id, todoDto);
        return this.findOne(id);
    }
    async remove(id: number, userId: number): Promise<void> {
        const todo = await this.todoRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['user']

        })
        if (!todo) {
            throw new Error('Todo not found');
        }
        if (todo.isDeleted) {
            throw new Error('Todo already deleted');
        }
        if (todo.user.id !== userId) {
            throw new Error('You are not authorized to delete this todo');
        }


        await this.todoRepository.update(id, { isDeleted: true });
    }

}
