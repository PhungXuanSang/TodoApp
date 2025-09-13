import { UserRole } from 'src/users/entity/user.role';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
