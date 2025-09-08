import { Controller,  Body, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {

    constructor(private readonly usersService : UsersService){}
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.usersService.createUser(createUserDto);
    }
    @Get()
    async findAll(){
        return this.usersService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id : number){
        return this.usersService.findOne(+id);
    }
    @Patch(':id')
    async update(@Param('id') id : number, @Body() updateUserDto : UpdateUserDto){
        return this.usersService.update(+id, updateUserDto);
    }
    @Delete(':id')
    async remove(@Param('id') id : number){
        return this.usersService.remove(+id);
    }
}
