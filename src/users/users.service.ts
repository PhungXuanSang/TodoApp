import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRole } from './entity/user.role';
@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  // Create a new user
  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const user = this.userRepository.create(createUserDto);
  //   return this.userRepository.save(user);
  // }
  //
  async findAll(): Promise<UserResponseDto[]> {
    const user = await this.userRepo.findUser();
    return user.map((user) => ({
      id: user.id,
      avatar: user.avatar,
      fullname: user.auth.fullname,
      email: user.auth.email,
      role: user.auth.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
  //
  async findOne(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepo.findById(id);
    if (!user) return null;
    return {
      id: user.id,
      avatar: user.avatar,
      fullname: user.auth.fullname,
      email: user.auth.email,
      role: user.auth.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  //
  async update(userId: number, userDto: UserDto): Promise<UserDto> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    if (user.id == 1) {
      throw new ForbiddenException('not del admin');
    }

    return await this.userRepo.updateUser(user, userDto);
  }
  //
  async remove(id: number): Promise<void> {
    await this.userRepo.deleteUser(id);
  }
  async updateAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.userRepo.findOne({
      where: { id: userId, isDeleted: false },
      relations: ['auth'],
    });

    if (!user) throw new NotFoundException('User not found');
    console.log(user.auth.role + 'role');
    if (user.auth.role == 'admin') {
      const idToUpdate = user.id;
      return await this.userRepo.updateAvatar(idToUpdate, file.filename);
    }

    if (user.auth.role == 'user') {
      return await this.userRepo.updateAvatar(userId, file.filename);
    }

    throw new ForbiddenException('You are not allowed to update avatar');
  }
}
