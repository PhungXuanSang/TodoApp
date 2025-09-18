import { UserRole } from 'src/users/entity/user.role';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}
