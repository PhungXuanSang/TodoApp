import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
       private userRepository : Repository<User>,
    ){}

    // Create a new user
    async createUser(createUserDto: CreateUserDto): Promise<User>{
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    //
    async findAll   (): Promise<User[]>{
        return this.userRepository.find();
    }
    // 
    async findOne(id : number): Promise<User | null>{
        return this.userRepository.findOneBy({id});
    }
    //
    async update (id : number, updateUserDto : UpdateUserDto): Promise<User | null>{

        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }
    // 
    async remove (id : number): Promise<void>{
        await this.userRepository.delete(id);
    }
}
