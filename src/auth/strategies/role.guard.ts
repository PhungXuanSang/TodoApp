import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.Decorator';
import { UserInfo } from 'src/todos/common/interfaces/userInfo';
import { jwtStrategy } from './Jwt.strategy';
import { JwtPayload } from '../common/JwtPayload';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<UserInfo>();
    const user = request.user.role;
    console.log(user + 'sssssssssss');
    console.log(request.user.role);
    return requiredRoles.includes(user);
  }
}
