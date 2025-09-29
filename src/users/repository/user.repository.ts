import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/users.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { TodoMessages } from 'src/todos/constants/todos.messages';
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private datasource: DataSource) {
    super(User, datasource.createEntityManager());
  }
  async createUser(): Promise<User> {
    const newUser = this.create({
      avatar: 'https://example.com/default-avatar.png',
      isDeleted: false,
    });
    return await this.save(newUser);
  }
  async findById(id: number): Promise<User | null> {
    return await this.findOne({
      where: { id, isDeleted: false },
      relations: ['auth'],
    });
  }
  async findUser() {
    return await this.find({
      where: { isDeleted: false },
      relations: ['auth'],
    });
  }
  // async findOne(id: number) {
  //   return await this.findOne({
  //     where: { id, isDeleted: false },
  //   });
  // }
  async updateUser(user: User, userDto: UserDto): Promise<User> {
    Object.assign(user, userDto);
    return await this.save(user);
  }
  async deleteUser(id: number): Promise<User> {
    const delUser = await this.findOne({ where: { id, isDeleted: false } });
    if (!delUser) {
      throw new NotFoundException('User not found');
    }
    if (delUser.id == 1) {
      throw new ForbiddenException('Not del admin');
    }
    delUser.isDeleted = true;
    return this.save(delUser);
  }
  async updateAvatar(userId: number, avatarPath: string): Promise<User | null> {
    await this.update({ id: userId }, { avatar: avatarPath });
    console.log(avatarPath + 'avatarPath');
    return this.findOne({ where: { id: userId, isDeleted: false } });
  }
}
