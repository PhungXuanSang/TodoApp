import { UserRole } from '../entity/user.role';
import { User } from '../entity/users.entity';

export class UserResponseDto {
  id: number;
  fullname: string;
  email: string;
  avatar: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
// export const toUserResponse = (user: User) => ({
//   id: user.id,
//   avatar: user.avatar,
//   createdAt: user.createdAt,
//   updatedAt: user.updatedAt,
//   fullname: user.auth?.fullname,
//   role: user.auth?.role,
// });
