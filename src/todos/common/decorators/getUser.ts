import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../interfaces/userInfo';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<UserInfo>();
    return request.user;
  },
);
