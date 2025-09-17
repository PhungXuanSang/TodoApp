import { UserRole } from 'src/users/entity/user.role';

export interface UserInfo {
  user: {
    userId: number;
    email: string;
    avatar: string;
    role: UserRole;
  };
}
