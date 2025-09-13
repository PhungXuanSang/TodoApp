import { User } from '../entity/users.entity';

export class UserResponseDto {
  id: number;
  fullname: string;
  avatar: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.role = user.auth.role;
  }
}
