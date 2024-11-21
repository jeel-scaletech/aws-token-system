import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { oneLine } from 'common-tags';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const _user = request.user;

    if (!_user) {
      console.error(oneLine`
        This Param Decorator is supposed to be used with Passport Guards,
        or some middleware thats sets \`request.user\` object.
      `);
      throw new UnauthorizedException('User was null');
    }

    return _user;
  },
);
